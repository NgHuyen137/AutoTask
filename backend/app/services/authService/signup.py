from fastapi import BackgroundTasks

from app.config.frontend import frontend_settings
from app.schemas.userSchema import UserCreate
from app.services.mailService.sendEmail import send_email_verification_link
from app.services.userService.crud import create_user_with_password, get_user_by_email
from app.utils.auth import create_url_safe_token, get_password_hash


async def signup_user_account(background_tasks: BackgroundTasks, user: UserCreate):
  # Check if the user already exists
  existing_user = await get_user_by_email(user.email)
  if existing_user:
    if "email" in existing_user.auth_providers:
      return None
    else:
      # Update auth providers
      existing_user.auth_providers.append("email")
      await existing_user.save()
      return existing_user

  new_user_dict = user.model_dump(exclude=["password"])
  new_user_dict["hashed_password"] = get_password_hash(user.password)

  new_user = await create_user_with_password(
    new_user_dict["name"], 
    new_user_dict["email"], 
    new_user_dict["hashed_password"]
  )
  if new_user:
    # Send user verification email after signed up successfully
    verification_token = create_url_safe_token(
      {"email": new_user.email}, 
      salt="email-verification"
    )
    verification_link = f"{frontend_settings.DOMAIN}/verify/{verification_token}"
    await send_email_verification_link(
      background_tasks, new_user.email, verification_link
    )
    return new_user
  return None
