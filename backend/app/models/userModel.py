from datetime import datetime
from typing import Optional

from beanie import Document
from pydantic import EmailStr, Field


class User(Document):
	email: EmailStr
	hashed_password: str = Field(exclude=True)
	created_at: datetime
	updated_at: Optional[datetime] = None

	class Settings:
		name = "user_collection"
