from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from app.exceptions.userExceptions import AccessTokenExpiredError
from app.services.userService.crud import get_user_by_id
from app.utils.auth import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
	payload = await verify_token(token)
	if payload:
		user_id = payload.get("sub")
		user = await get_user_by_id(user_id)
		if user:
			return user
	raise AccessTokenExpiredError()
