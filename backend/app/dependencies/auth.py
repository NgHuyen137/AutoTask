from typing import Annotated

import jwt
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError

from app.config.settings import settings
from app.db.redis import token_in_blacklist
from app.exceptions.userExceptions import UnauthorizedError
from app.services.userService.crud import get_user_by_id

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
	try:
		payload = jwt.decode(
			token, key=settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
		)

		user_id = payload.get("sub")
		jti = payload.get("jti")

		# Check if the token is blacklisted
		is_blacklisted = await token_in_blacklist(jti)
		if is_blacklisted:
			raise UnauthorizedError()

		user = await get_user_by_id(user_id)
		if user:
			return user
		raise UnauthorizedError()
	except InvalidTokenError:
		raise UnauthorizedError()
