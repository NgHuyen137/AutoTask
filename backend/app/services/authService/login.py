import uuid
from datetime import datetime, timedelta
from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.config.security import security_settings
from app.services.userService.crud import get_user_by_id
from app.utils.auth import authenticate_user, create_access_token, verify_token


async def login_user_account(
  form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
):
  user = await authenticate_user(form_data.username, form_data.password)
  if user and user.is_verified:
    access_token = create_access_token(
      {"sub": str(user.id), "email": user.email, "jti": str(uuid.uuid4())}
    )
    refresh_token = create_access_token(
      {"sub": str(user.id), "email": user.email, "jti": str(uuid.uuid4())},
      expires_delta=timedelta(days=security_settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    return {
      "user_id": user.id, 
      "is_verified": user.is_verified, 
      "access_token": access_token, 
      "refresh_token": refresh_token
    }
  if user and not user.is_verified:
    return { 
      "user_id": user.id, 
      "is_verified": user.is_verified,
      "access_token": None,
      "refresh_token": None
    }
  if not user:
    return { 
      "user_id": None, 
      "is_verified": False,
      "access_token": None,
      "refresh_token": None
    }


async def refresh_access_token(refresh_token: str):
  payload = await verify_token(refresh_token)
  if payload:
    user = await get_user_by_id(payload["sub"])
    if user:
      expiry_timestamp = payload.get("exp")
      if datetime.fromtimestamp(expiry_timestamp) > datetime.now():
        new_access_token = create_access_token(
          {"sub": str(user.id), "email": user.email, "jti": str(uuid.uuid4())}
        )
        return {"access_token": new_access_token}
  return None
