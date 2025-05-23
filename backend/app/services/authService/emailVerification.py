from app.config.email import email_settings
from app.utils.auth import decode_url_safe_token


async def verify_email_token(token: str, salt: str):
  max_age = email_settings.VERIFICATION_LINK_EXPIRE_DAYS * 24 * 60 * 60
  token_data = decode_url_safe_token(token, salt, max_age)
  if token_data:
    return token_data
  return None
