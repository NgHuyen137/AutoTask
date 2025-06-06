from typing import Annotated, Optional
from datetime import timedelta

import uuid
import requests
from fastapi import (
  APIRouter, 
  BackgroundTasks, 
  Cookie, 
  Depends, 
  Request, 
  Response, 
  status
)
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from authlib.integrations.starlette_client import OAuth

from app.config.security import security_settings
from app.config.frontend import frontend_settings
from app.exceptions.passwordExceptions import PasswordAndConfirmPasswordMismatchError
from app.exceptions.authExceptions import (
  InvalidTokenError,
  UnauthorizedError,
  EmailVerificationError,
  RefreshTokenExpiredError,
  UserAlreadyExistsError,
  UserNotFoundError
)
from app.dependencies.auth import get_token_from_request
from app.schemas.passwordResetSchema import PasswordResetSchema
from app.schemas.userSchema import UserCreate
from app.schemas.emailVerificationSchema import EmailVerificationSchema
from app.services.authService.emailVerification import verify_email_token
from app.services.authService.login import login_user_account, refresh_access_token
from app.services.authService.logout import logout_user_account
from app.services.authService.resetPassword import send_confirm_reset_password
from app.services.authService.signup import signup_user_account
from app.services.mailService.sendEmail import send_email_verification_link
from app.services.userService.crud import get_user_by_email, create_user_with_google
from app.utils.auth import get_password_hash, create_url_safe_token, create_access_token

auth_router = APIRouter(prefix="/auth")

oauth = OAuth()
oauth.register(
  name="google",
  client_id=security_settings.GOOGLE_CLIENT_ID,
  client_secret=security_settings.GOOGLE_CLIENT_SECRET,
  authorize_url="https://accounts.google.com/o/oauth2/auth",
  authorize_params=None,
  access_token_url="https://accounts.google.com/o/oauth2/token",
  access_token_params=None,
  refresh_token_url=None,
  authorize_state=security_settings.SECRET_KEY,
  redirect_uri=security_settings.REDIRECT_URL,
  jwks_uri="https://www.googleapis.com/oauth2/v3/certs",
  client_kwargs={"scope": "openid profile email"}
)


@auth_router.post("/signup")
async def signup(
  response: Response, background_tasks: BackgroundTasks, user: UserCreate
):
  """
  Signup a new user account.
  """
  new_user = await signup_user_account(background_tasks, user)
  if new_user:
    response.status_code = status.HTTP_201_CREATED
    return new_user
  raise UserAlreadyExistsError()


@auth_router.post("/login/password")
async def login_password(
  form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
  """
  Login a user account and return access token and refresh token.
  """
  res = await login_user_account(form_data)
  if res["access_token"] and res["refresh_token"]:
    json_response = JSONResponse(
      content={
        "access_token": res["access_token"]
      },
      status_code=status.HTTP_200_OK
    )

    # Store refresh token in httpOnly cookie
    json_response.set_cookie(
      key="refresh_token",
      value=res["refresh_token"],
      httponly=True,
      secure=True,
      samesite="none",
      max_age=security_settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
    )
    return json_response
  
  if res["user"] and not res["is_verified"]:
    raise EmailVerificationError()

  if not res["user"]:
    raise UnauthorizedError()
  

@auth_router.get("/login/google")
async def login_google(request: Request):
  """
  Redirect to Google OAuth2 login page.
  """ 
  return await oauth.google.authorize_redirect(
    request, 
    security_settings.REDIRECT_URL, 
    prompt="consent"
  )


@auth_router.get("/callback")
async def login_google_callback(request: Request):
  # Exchange token
  try:
    token = await oauth.google.authorize_access_token(request)
  except Exception as e:
    raise UnauthorizedError()

  # Fetch user info from Google
  try:
    user_info_endpoint = "https://www.googleapis.com/oauth2/v2/userinfo"
    headers = {"Authorization": f"Bearer {token["access_token"]}"}
    google_response = requests.get(user_info_endpoint, headers=headers)
    user_info = google_response.json()
  except Exception as e:
    raise UnauthorizedError()

  # Extract user information
  user = token.get("userinfo")
  google_id = user.get("sub")
  user_email = user.get("email")
  user_name = user_info.get("name")
  user_pic = user_info.get("picture")

  # Check if the email has been used
  existing_user = await get_user_by_email(user_email)
  if not existing_user:
    # Create new account
    new_user = await create_user_with_google(
      name=user_name,
      email=user_email,
      google_id=google_id,
      picture=user_pic
    )

  elif "google" not in existing_user.auth_providers:
    # Update existing user with Google info
    existing_user.google_id = google_id
    existing_user.picture = user_pic
    existing_user.auth_providers.append("google")
    await existing_user.save()

  # Create JWT token
  user_id = existing_user.id if existing_user else new_user.id
  access_token = create_access_token(
    {"sub": str(user_id), "email": user_email, "jti": str(uuid.uuid4())}
  )

  # Create refresh token
  refresh_token = create_access_token(
    {"sub": str(user_id), "email": user_email, "jti": str(uuid.uuid4())},
    expires_delta=timedelta(days=security_settings.REFRESH_TOKEN_EXPIRE_DAYS)
  )

  response = RedirectResponse(url=security_settings.FRONTEND_URL)

  response.set_cookie(
    key="access_token",
    value=access_token,
    httponly=True,
    secure=True,
    samesite="none",
    max_age=security_settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
  )

  response.set_cookie(
    key="refresh_token",
    value=refresh_token,
    httponly=True,
    secure=True,
    samesite="none",
    max_age=security_settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
  )

  return response


@auth_router.post("/refresh")
async def refresh(refresh_token: Optional[str] = Cookie(None, alias="refresh_token")):
  """
  Refresh the access token using the refresh token.
  """
  if refresh_token:
    result = await refresh_access_token(refresh_token)
    if result:
      return JSONResponse(
        content={
          "access_token": result["access_token"],
          "user": {
            "email": result["user"].email,
            "name": result["user"].name,
            "is_verified": result["user"].is_verified
          }
        },
        status_code=status.HTTP_200_OK
      )
  raise RefreshTokenExpiredError()


@auth_router.post("/logout")
async def logout(
  response: Response,
  access_token: str = Depends(get_token_from_request),
  refresh_token: Optional[str] = Cookie(None, alias="refresh_token")
):
  """
  Logout the user by invalidating the access token and refresh token.
  """
  await logout_user_account(access_token, refresh_token)
  response.delete_cookie(key="access_token")
  response.delete_cookie(key="refresh_token")
  return JSONResponse(
    content={"message": "Logout successfully!"},
    status_code=status.HTTP_200_OK
  )


@auth_router.get("/verify/{token}")
async def verify_email(token: str):
  """
  Verify the email address using the token.
  """
  token_data = await verify_email_token(token, salt="email-verification")
  if token_data:
    email = token_data.get("email")
    user = await get_user_by_email(email)
    if not user:
      raise UnauthorizedError()

    user.is_verified = True
    await user.save()
    return JSONResponse(
      content={
        "email": email,
        "status_code": 200,
        "message": "Email verified successfully!"
      },
      status_code=status.HTTP_200_OK,
    )

  raise InvalidTokenError()


@auth_router.post("/send-verification-email")
async def send_verification_link(
  background_tasks: BackgroundTasks, 
  data: EmailVerificationSchema
):
  """
    Send a verification link to the specified email
  """
  user = await get_user_by_email(data.email)
  if user:
    verification_token = create_url_safe_token(
      {"email": data.email},
      salt="email-verification"
    )
    verification_link = f"http://{frontend_settings.DOMAIN}/verify/{verification_token}"
    await send_email_verification_link(background_tasks, data.email, verification_link)
    return JSONResponse(
      content={"message": "Email verification link sent successfully!"},
      status_code=status.HTTP_200_OK
    )
  raise UserNotFoundError()


@auth_router.post("/confirm-password-reset")
async def password_reset_confirm(
  background_tasks: BackgroundTasks, 
  data: EmailVerificationSchema
):
  """
  Send a password reset email to the user.
  """
  success = await send_confirm_reset_password(background_tasks, data.email)
  if not success:
    raise UserNotFoundError()
  return JSONResponse(
    content={"message": "Password reset email sent successfully!"},
    status_code=status.HTTP_200_OK
  )


@auth_router.get("/confirm-password-reset/{token}")
async def verify_password_reset_token(token: str):
  """
  Verify the password reset token.
  """
  # Verify token
  token_data = await verify_email_token(token, salt="password-reset")
  if token_data:
    email = token_data.get("email")
    user = await get_user_by_email(email)
    if not user:
      raise UnauthorizedError()

    return JSONResponse(
      content={
        "email": email,
        "status_code": 200,
        "message": "Password reset successfully!"
      },
      status_code=status.HTTP_200_OK,
    )

  raise InvalidTokenError()


@auth_router.post("/reset-password")
async def reset_password(password_reset_data: PasswordResetSchema):
  """
  Reset the password for the user.
  """
  user = await get_user_by_email(password_reset_data.email)
  if not user:
    raise UnauthorizedError()

  # Check if the new password and confirm password match
  if password_reset_data.new_password != password_reset_data.confirm_password:
    raise PasswordAndConfirmPasswordMismatchError()

  # Hash the new password and update the user
  user.hashed_password = get_password_hash(password_reset_data.new_password)
  await user.save()

  return JSONResponse(
    content={"message": "Password reset successfully!"},
    status_code=status.HTTP_200_OK,
  )
