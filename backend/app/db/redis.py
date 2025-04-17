import time

import jwt
from jwt.exceptions import InvalidTokenError
from redis.asyncio import Redis

from app.config.settings import settings
from app.exceptions.userExceptions import UnauthorizedError


def get_redis_client():
	redis_client = Redis(
		host=settings.REDIS_HOST, port=settings.REDIS_PORT, decode_responses=True
	)
	return redis_client


async def blacklist_tokens(access_token: str, refresh_token: str):
	redis_client = get_redis_client()
	try:
		access_payload = jwt.decode(
			access_token,
			key=settings.JWT_SECRET_KEY,
			algorithms=[settings.JWT_ALGORITHM],
		)
		refresh_payload = jwt.decode(
			refresh_token,
			key=settings.JWT_SECRET_KEY,
			algorithms=[settings.JWT_ALGORITHM],
		)

		# Calculate TTLs
		access_ttl = access_payload.get("exp") - int(time.time())
		refresh_ttl = refresh_payload.get("exp") - int(time.time())

		# Store tokens in Redis with TTL
		await redis_client.setex(name=access_payload.get("jti"), value="", time=access_ttl)
		await redis_client.setex(
			name=refresh_payload.get("jti"), value="", time=refresh_ttl
		)

	except InvalidTokenError:
		raise UnauthorizedError()


async def token_in_blacklist(jti: str):
	redis_client = get_redis_client()
	if await redis_client.get(jti):
		return True
	return False
