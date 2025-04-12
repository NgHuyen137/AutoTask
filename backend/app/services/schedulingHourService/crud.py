from bson import ObjectId
from pymongo import ReturnDocument
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.schedulingHourModel import SchedulingHour
from app.utils.datetime import convert_day_of_week

async def get_scheduling_hours(db: AsyncIOMotorDatabase):
  result = await db.scheduling_hour_collection.find({}).to_list(length=None)
  if result:
    scheduling_hours = []
    for scheduling_hour_dict in result:
      scheduling_hours.append(SchedulingHour(**scheduling_hour_dict))
    return scheduling_hours
  return None


async def get_scheduling_hour_by_id(id: str, db: AsyncIOMotorDatabase):
    filter = {"_id": ObjectId(id)}
    scheduling_hour = await db.scheduling_hour_collection.find_one(filter)
    if scheduling_hour:
        return SchedulingHour(**scheduling_hour)
    return None


async def create_scheduling_hour(scheduling_hour: SchedulingHour, db: AsyncIOMotorDatabase):
    new_scheduling_hour = scheduling_hour.model_dump()
    
    # Convert Time objects to Datetime objects before storing in MongoDB
    converted_days_of_week = list(map(convert_day_of_week, new_scheduling_hour["days_of_week"])) 
    new_scheduling_hour["days_of_week"] = converted_days_of_week

    result = await db.scheduling_hour_collection.insert_one(new_scheduling_hour)
    if result.inserted_id: # Check if the data has been created successfully
        new_id = str(result.inserted_id) # Convert ObjectId to String
        new_scheduling_hour["id"] = new_id
        return SchedulingHour(**new_scheduling_hour)
    return None




