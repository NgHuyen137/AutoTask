from typing import Annotated
from fastapi import APIRouter, Depends

from app.models.userModel import User
from app.dependencies.auth import get_current_user

user_router = APIRouter()

@user_router.get("/users/me")
async def get_user(current_user: Annotated[User, Depends(get_current_user)]):
  return current_user
