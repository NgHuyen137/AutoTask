from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.userModel import User, UserInDB

# async def create_account(user: User, db: AsyncIOMotorDatabase):
#   new_user = user.model_dump() 
#   result = await db.user_collection.insert_one(new_user)
#   if result:
    