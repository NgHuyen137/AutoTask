from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.utils.datetime import get_utc_now


class UserCreate(BaseModel):
	email: EmailStr
	password: str = Field(min_length=8)
	created_at: datetime = Field(default_factory=get_utc_now)


class UserUpdate(BaseModel):
	email: EmailStr
	password: str = Field(min_length=8)
	is_verified: bool = False
	created_at: datetime
	updated_at: datetime = Field(default_factory=get_utc_now)


class TokenResponse(BaseModel):
	access_token: str
	token_type: str
