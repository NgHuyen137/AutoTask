from pydantic_settings import BaseSettings


class Settings(BaseSettings):
	# MongoDB settings
	MONGODB_URI: str
	DB_NAME: str

	# JWT settings
	JWT_SECRET_KEY: str
	JWT_ALGORITHM: str
	ACCESS_TOKEN_EXPIRE_MINUTES: int
	REFRESH_TOKEN_EXPIRE_DAYS: int

	# Redis settings
	REDIS_HOST: str
	REDIS_PORT: int

	class Config:
		env_file = ".env"


settings = Settings()
