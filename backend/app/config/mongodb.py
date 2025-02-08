from pydantic_settings import BaseSettings

class DBSettings(BaseSettings):
    MONGODB_URI: str
    DB_NAME: str

    class Config:
        env_file = ".env"

db_settings = DBSettings()