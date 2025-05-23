from fastapi import BackgroundTasks
from pydantic import EmailStr

from app.config.frontend import frontend_settings
from app.services.mailService.sendEmail import send_password_reset_link
from app.services.userService.crud import get_user_by_email
from app.utils.auth import create_url_safe_token


async def send_confirm_reset_password(
  background_tasks: BackgroundTasks, email: EmailStr
):
  user = await get_user_by_email(email)
  if user:
    password_reset_token = create_url_safe_token(
      {"email": user.email}, 
      salt="password-reset"
    )
    password_reset_link = (
      f"http://{frontend_settings.DOMAIN}/forgot-password/{password_reset_token}"
    )
    await send_password_reset_link(background_tasks, user.email, password_reset_link)
    return True
  return False
