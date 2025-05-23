from pydantic_settings import BaseSettings


class EmailSettings(BaseSettings):
  MAIL_USERNAME: str
  MAIL_PASSWORD: str
  MAIL_FROM: str
  MAIL_PORT: int
  MAIL_SERVER: str
  MAIL_FROM_NAME: str
  MAIL_STARTTLS: bool
  MAIL_SSL_TLS: bool
  USE_CREDENTIALS: bool
  VALIDATE_CERTS: bool
  VERIFICATION_LINK_EXPIRE_DAYS: int

  class Config:
    env_file = ".env"
    extra = "ignore"


email_settings = EmailSettings()
