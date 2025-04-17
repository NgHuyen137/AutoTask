from typing import Annotated, Optional

from fastapi import APIRouter, Cookie, Depends, Response, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from app.config.settings import settings
from app.exceptions.userExceptions import UnauthorizedError, UserAlreadyExistsError
from app.schemas.userSchema import TokenResponse, UserCreate
from app.services.authService.login import login_user_account
from app.services.authService.logout import logout_user_account
from app.services.authService.signup import signup_user_account

auth_router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


@auth_router.post("/signup")
async def signup(response: Response, user: UserCreate):
	new_user = await signup_user_account(user)
	if new_user:
		response.status_code = status.HTTP_201_CREATED
		return new_user
	raise UserAlreadyExistsError()


@auth_router.post("/login")
async def login(
	response: Response, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
	tokens = await login_user_account(form_data)
	if tokens:
		# Store refresh token in httpOnly cookie
		response.set_cookie(
			key="refresh_token",
			value=tokens["refresh_token"],
			httponly=True,
			secure=True,
			samesite="none",
			max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
		)
		return TokenResponse(access_token=tokens["access_token"], token_type="bearer")

	raise UnauthorizedError()


@auth_router.get("/logout")
async def logout(
	response: Response,
	access_token: str = Depends(oauth2_scheme),
	refresh_token: Optional[str] = Cookie(None, alias="refresh_token"),
):
	if not refresh_token:
		raise UnauthorizedError()

	await logout_user_account(access_token, refresh_token)
	response.delete_cookie(key="refresh_token")
	return {"message": "Logout successfully!"}
