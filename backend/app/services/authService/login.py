import uuid
from datetime import timedelta
from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.config.settings import settings
from app.services.userService.crud import get_user_by_email
from app.utils.auth import create_access_token, verify_password


async def authenticate_user(email: str, password: str):
	# Check if the user exists
	user = await get_user_by_email(email)
	if user:
		# Verify the password
		is_valid_password = verify_password(password, user.hashed_password)
		if is_valid_password:
			return user
	return None


async def login_user_account(
	form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
):
	user = await authenticate_user(form_data.username, form_data.password)
	if user:
		access_token = create_access_token(
			{"sub": str(user.id), "email": user.email, "jti": str(uuid.uuid4())}
		)
		refresh_token = create_access_token(
			{"sub": str(user.id), "email": user.email, "jti": str(uuid.uuid4())},
			expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
		)
		return {"access_token": access_token, "refresh_token": refresh_token}
	return None
