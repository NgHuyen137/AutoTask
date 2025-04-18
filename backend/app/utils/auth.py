from datetime import datetime, timedelta, timezone

import jwt
from jwt import InvalidTokenError
from passlib.context import CryptContext

from app.config.settings import settings
from app.db.redis import token_in_blacklist
from app.services.userService.crud import get_user_by_email

pwd_context = CryptContext(schemes=["bcrypt"])


def get_password_hash(password: str) -> str:
	"""
	Hash a password using bcrypt.
	"""
	return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
	"""
	Verify a password against a hashed password.
	"""
	return pwd_context.verify(plain_password, hashed_password)


async def authenticate_user(email: str, password: str):
	# Check if the user exists
	user = await get_user_by_email(email)
	if user:
		# Verify the password
		is_valid_password = verify_password(password, user.hashed_password)
		if is_valid_password:
			return user
	return None


def create_access_token(data: dict, expires_delta: timedelta = None):
	"""
	Create a JWT access token with the provided data and expiration time.
	"""
	payload = data.copy()
	if expires_delta:
		exp = datetime.now(timezone.utc) + expires_delta
	else:
		exp = datetime.now(timezone.utc) + timedelta(
			minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
		)
	payload["exp"] = exp
	token = jwt.encode(
		payload=payload, key=settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
	)
	return token


async def verify_token(token: str):
	"""
	Verify a JWT token and return the payload if valid.
	"""
	try:
		payload = jwt.decode(
			token, key=settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
		)

		jti = payload.get("jti")
		is_blacklisted = await token_in_blacklist(jti)
		if is_blacklisted:
			return None
		return payload
	except InvalidTokenError:
		return None
