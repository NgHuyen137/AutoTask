from typing import Optional
from pydantic import BaseModel, Field
from app.utils.mongodb import PyObjectId

class UserCreate(BaseModel):
  username: str
  password: str

class UserOut(UserCreate):
  id: Optional[PyObjectId] = Field(alias="_id", default=None)
  hashed_password: str