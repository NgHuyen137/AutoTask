from datetime import datetime
from typing import Optional, List

from beanie import Document
from pydantic import EmailStr, Field

from app.utils.datetime import get_utc_now


class User(Document):
  name: str = ""
  email: EmailStr
  hashed_password: Optional[str] = Field(
    default=None,
    exclude=True
  )  # Do not include hashed password in the response
  is_verified: bool = False  # For email verification
  google_id: Optional[str] = None  # For Google OAuth
  picture: Optional[str] = None  # URL to the user's profile picture
  auth_providers: List[str] = ["email"]  # List of authentication providers
  created_at: datetime = Field(default_factory=get_utc_now)
  updated_at: Optional[datetime] = None

  class Settings:
    name = "user_collection"
