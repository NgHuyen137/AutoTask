from pydantic import BaseModel, Field, EmailStr


class PasswordResetSchema(BaseModel):
  email: EmailStr
  new_password: str = Field(min_length=8)
  confirm_password: str = Field(min_length=8)
