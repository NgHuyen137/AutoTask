from typing import Optional
from beanie.operators import Eq
from pydantic import EmailStr

from app.models.userModel import User


async def get_user_by_id(id: str):
  user = await User.get(id)
  if user:
    return user
  return None


async def get_user_by_email(email: EmailStr):
  user = await User.find_one(Eq("email", email))
  if user:
    return user
  return None


async def create_user_with_password(name: str, email: EmailStr, hashed_password: str):
  new_user = User(name=name, email=email, hashed_password=hashed_password)
  await new_user.insert()

  if new_user.id:
    return new_user
  return None


async def create_user_with_google(
  name: str, email: EmailStr, google_id: str, picture: Optional[str] = None
):
  new_user = User(
    name=name,
    email=email,
    is_verified=True,  
    google_id=google_id,
    picture=picture,
    auth_providers=["google"]
  )
  await new_user.insert()

  if new_user.id:
    return new_user
  return None
