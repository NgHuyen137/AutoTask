from fastapi import APIRouter
from pydantic import EmailStr

from app.services.userService.crud import get_user_by_email
from app.exceptions.userExceptions import UserNotFoundError

user_router = APIRouter()

@user_router.get("/users")
async def get_single_user_by_email(email: EmailStr):
  user = await get_user_by_email(email)
  if user:
    return user
  raise UserNotFoundError()
