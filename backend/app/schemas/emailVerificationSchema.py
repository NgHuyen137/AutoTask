from pydantic import BaseModel, EmailStr

class EmailVerificationSchema(BaseModel):
  email: EmailStr
