from pydantic_settings import BaseSettings


class DBSettings(BaseSettings):
  # MongoDB settings
  MONGODB_URI: str
  DB_NAME: str

  # Redis settings
  REDIS_HOST: str
  REDIS_PORT: int

  class Config:
    env_file = ".env"
    extra = "ignore"


db_settings = DBSettings()
