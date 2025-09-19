import time

import jwt
from jwt.exceptions import InvalidTokenError
from redis.asyncio import Redis

from app.config.database import db_settings
from app.config.security import security_settings


redis_client = Redis(
  host=db_settings.REDIS_HOST, 
  port=db_settings.REDIS_PORT, 
  decode_responses=True,
  ssl=False
)

async def blacklist_tokens(access_token: str, refresh_token: str):
  # Blacklist access token
  try:
    access_payload = jwt.decode(
      access_token,
      key=security_settings.JWT_SECRET_KEY,
      algorithms=[security_settings.JWT_ALGORITHM],
    )
    access_ttl = access_payload.get("exp") - int(time.time())
    await redis_client.set(name=access_payload.get("jti"), value="", ex=access_ttl)
  except InvalidTokenError:
    pass

  # Blacklist refresh token
  try:
    refresh_payload = jwt.decode(
      refresh_token,
      key=security_settings.JWT_SECRET_KEY,
      algorithms=[security_settings.JWT_ALGORITHM],
    )
    refresh_ttl = refresh_payload.get("exp") - int(time.time())
    await redis_client.set(
      name=refresh_payload.get("jti"), value="", ex=refresh_ttl
    )
  except InvalidTokenError:
    pass


async def token_in_blacklist(jti: str):
  value = await redis_client.get(jti)
  if value is not None:
    return True
  return False
