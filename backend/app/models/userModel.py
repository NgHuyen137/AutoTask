from beanie import Document

class User(Document):
  username: str
  hashed_password: str

  class Settings:
    name = "user_collection"