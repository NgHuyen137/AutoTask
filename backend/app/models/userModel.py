from datetime import datetime
from typing import Optional

from beanie import Document
from pydantic import EmailStr, Field

from app.utils.datetime import get_utc_now


class User(Document):
  name: str = ""
  email: EmailStr
  hashed_password: str = Field(
    exclude=True
  )  # Do not include hashed password in the response
  is_verified: bool = False  # For email verification
  created_at: datetime = Field(default_factory=get_utc_now)
  updated_at: Optional[datetime] = None

  class Settings:
    name = "user_collection"
