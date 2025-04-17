from datetime import datetime, timedelta, timezone

import jwt
from passlib.context import CryptContext

from app.config.settings import settings

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
