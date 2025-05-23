from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.utils.datetime import get_utc_now


class UserCreate(BaseModel):
  name: str
  email: EmailStr
  password: str = Field(min_length=8)
  created_at: datetime = Field(default_factory=get_utc_now)


class UserUpdate(BaseModel):
  email: EmailStr
  password: str = Field(min_length=8, default=None)
  is_verified: bool
  created_at: datetime
  updated_at: datetime = Field(default_factory=get_utc_now)


class TokenResponse(BaseModel):
  access_token: str
  token_type: str
