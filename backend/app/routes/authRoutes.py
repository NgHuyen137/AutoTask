from typing import Annotated, Optional

from fastapi import APIRouter, BackgroundTasks, Cookie, Depends, Response, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from app.config.security import security_settings
from app.config.frontend import frontend_settings
from app.exceptions.passwordExceptions import PasswordAndConfirmPasswordMismatchError
from app.exceptions.userExceptions import (
  InvalidTokenError,
  UnauthorizedError,
  EmailVerificationError,
  RefreshTokenExpiredError,
  UserAlreadyExistsError,
  UserNotFoundError
)
from app.schemas.passwordResetSchema import PasswordResetSchema
from app.schemas.userSchema import TokenResponse, UserCreate
from app.schemas.emailVerificationSchema import EmailVerificationSchema
from app.services.authService.emailVerification import verify_email_token
from app.services.authService.login import login_user_account, refresh_access_token
from app.services.authService.logout import logout_user_account
from app.services.authService.resetPassword import send_confirm_reset_password
from app.services.authService.signup import signup_user_account
from app.services.mailService.sendEmail import send_email_verification_link
from app.services.userService.crud import get_user_by_email
from app.utils.auth import get_password_hash, create_url_safe_token

auth_router = APIRouter(prefix="/auth")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


@auth_router.post("/signup")
async def signup(
  response: Response, background_tasks: BackgroundTasks, user: UserCreate
):
  new_user = await signup_user_account(background_tasks, user)
  if new_user:
    response.status_code = status.HTTP_201_CREATED
    return new_user
  raise UserAlreadyExistsError()


@auth_router.post("/login")
async def login(
  response: Response, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
  res = await login_user_account(form_data)
  if res["access_token"] and res["refresh_token"]:
    # Store refresh token in httpOnly cookie
    response.set_cookie(
      key="refresh_token",
      value=res["refresh_token"],
      httponly=True,
      secure=True,
      samesite="none",
      max_age=security_settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
    )
    return TokenResponse(access_token=res["access_token"], token_type="bearer")
  
  if res["user_id"] and not res["is_verified"]:
    raise EmailVerificationError()

  if not res["user_id"]:
    raise UnauthorizedError()


@auth_router.post("/refresh")
async def refresh(refresh_token: Optional[str] = Cookie(None, alias="refresh_token")):
  if refresh_token:
    result = await refresh_access_token(refresh_token)
    if result:
      return TokenResponse(access_token=result["access_token"], token_type="bearer")
  raise RefreshTokenExpiredError()


@auth_router.post("/logout")
async def logout(
  response: Response,
  access_token: str = Depends(oauth2_scheme),
  refresh_token: Optional[str] = Cookie(None, alias="refresh_token")
):
  """
  Logout the user by invalidating the access token and refresh token.
  """
  await logout_user_account(access_token, refresh_token)
  response.delete_cookie(key="refresh_token")
  return {"message": "Logout successfully!"}


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
    verification_token = create_url_safe_token({"email": data.email})
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
    raise UnauthorizedError()
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
