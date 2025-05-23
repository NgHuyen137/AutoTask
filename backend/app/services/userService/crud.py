from beanie.operators import Eq
from pydantic import EmailStr

from app.models.userModel import User
from app.schemas.userSchema import UserUpdate


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


async def create_user(name: str, email: EmailStr, hashed_password: str):
  new_user = User(name=name, email=email, hashed_password=hashed_password)
  await new_user.insert()

  if new_user.id:
    return new_user
  return None


async def update_user(id: str, updated_data: UserUpdate):
  from app.utils.auth import get_password_hash

  updated_data_dict = updated_data.model_dump()
  updated_data_dict["id"] = id
  password = updated_data_dict.pop("password", None)
  if password:
    updated_data_dict["hashed_password"] = get_password_hash(password)
  updated_user = User(**updated_data_dict)
  await updated_user.save()
