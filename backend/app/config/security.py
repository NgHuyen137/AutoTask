from pydantic_settings import BaseSettings


class SecuritySettings(BaseSettings):
  JWT_SECRET_KEY: str
  JWT_ALGORITHM: str
  ACCESS_TOKEN_EXPIRE_MINUTES: int
  REFRESH_TOKEN_EXPIRE_DAYS: int
  GOOGLE_CLIENT_ID: str
  GOOGLE_CLIENT_SECRET: str
  REDIRECT_URL: str
  FRONTEND_URL: str
  SECRET_KEY: str
  FASTAPI_SECRET_KEY: str

  class Config:
    env_file = ".env"
    extra = "ignore"


security_settings = SecuritySettings()
