from datetime import datetime, timedelta, timezone

import jwt
from itsdangerous import URLSafeTimedSerializer
from jwt import InvalidTokenError
from passlib.context import CryptContext

from app.config.security import security_settings
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
      minutes=security_settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
  payload["exp"] = exp
  token = jwt.encode(
    payload=payload,
    key=security_settings.JWT_SECRET_KEY,
    algorithm=security_settings.JWT_ALGORITHM,
  )
  return token


async def verify_token(token: str):
  """
  Verify a JWT token and return the payload if valid.
  """
  try:
    payload = jwt.decode(
      token,
      key=security_settings.JWT_SECRET_KEY,
      algorithms=[security_settings.JWT_ALGORITHM],
    )

    jti = payload.get("jti")
    is_blacklisted = await token_in_blacklist(jti)
    if is_blacklisted:
      return None
    return payload
  except InvalidTokenError:
    return None


serializer = URLSafeTimedSerializer(
  security_settings.JWT_SECRET_KEY
)


def create_url_safe_token(data: dict, salt: str):
  """
  Create a URL-safe token using itsdangerous library.
  """
  token = serializer.dumps(data, salt=salt)
  return token


def decode_url_safe_token(token: str, salt: str, max_age: int = 3600):
  """
  Decode a URL-safe token and return the data if valid.
  """
  try:
    token_data = serializer.loads(token, max_age=max_age, salt=salt)
    return token_data
  except Exception:  # In case SignatureExpired or BadSignature
    return None
