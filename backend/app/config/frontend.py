from pydantic_settings import BaseSettings


class FrontendSettings(BaseSettings):
  DOMAIN: str

  class Config:
    env_file = ".env"
    extra = "ignore"


frontend_settings = FrontendSettings()
