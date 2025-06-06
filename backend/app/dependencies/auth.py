from fastapi import Request
from fastapi.security.utils import get_authorization_scheme_param

from app.exceptions.authExceptions import AccessTokenExpiredError
from app.services.userService.crud import get_user_by_id
from app.utils.auth import verify_token


def get_token_from_request(request: Request):
  # Try Authorization header first
  auth_header = request.headers.get("Authorization")
  scheme, token = get_authorization_scheme_param(auth_header)

  if scheme.lower() == "bearer" and token:
    return token

  # Fallback: try to get token from cookie
  token = request.cookies.get("access_token")
  if token:
    return token
  return None


async def get_current_user(request: Request):
  token = get_token_from_request(request)
  if token:
    payload = await verify_token(token)
    if payload:
      user_id = payload.get("sub")
      user = await get_user_by_id(user_id)
      if user:
        return user
  raise AccessTokenExpiredError()
