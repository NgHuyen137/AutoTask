from datetime import datetime, timezone
from bson import ObjectId
from pymongo import ReturnDocument
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.taskModel import Task, TaskUpdate
from app.utils.datetime import get_week_range


async def get_task_by_id(id: str, db: AsyncIOMotorDatabase):
  bson_id = ObjectId(id) # Convert the id in type String to ObjectId
  task = await db.task_collection.find_one(filter={"_id": bson_id})
  if task:
    return Task(**task)
  return None


async def get_tasks(start_of_week: str, end_of_week: str, db: AsyncIOMotorDatabase):
  results = await db.task_collection.aggregate([
    {
      "$unwind": "$time_allocations"  
    },
    {
      "$addFields": {
        "task_start_at": {
          "$dateToString": {
            "format": "%Y-%m-%d", 
            "date": "$time_allocations.start_at"
          }
        }
      }
    },
    {
      "$match": {
        "task_start_at": {
          "$gte": start_of_week, 
          "$lte": end_of_week 
        }
      }
    },
    {"$group": {
        "_id": "$_id", 
        "scheduling_hour_id": {"$first": "$scheduling_hour_id"},
        "smart_scheduling": {"$first": "$smart_scheduling"},
        "name": {"$first": "$name"},
        "priority": {"$first": "$priority"},
        "status": {"$first": "$status"},
        "tags": {"$first": "$tags"},
        "duration": {"$first": "$duration"},
        "split": {"$first": "$split"},
        "start_date": {"$first": "$start_date"},
        "due_date": {"$first": "$due_date"},
        "created_at": {"$first": "$created_at"},
        "updated_at": {"$first": "$updated_at"},
        "description": {"$first": "$description"},
        "time_allocations": {"$push": "$time_allocations"}  
    }},
    {
      "$project": {
        "task_start_at": 0
      }
    }
  ]).to_list(length=None)

  if results:
    tasks = []
    for task in results:
      tasks.append(Task(**task))
    return tasks
  return None


async def create_task(task: Task, db: AsyncIOMotorDatabase):
  from app.services.taskService.autoScheduler import find_optimal_time
  
  new_task = task.model_dump() 
  if task.smart_scheduling:
    time_allocations = await find_optimal_time(task, db)
    if time_allocations:
      new_task["time_allocations"] = time_allocations
  
  result = await db.task_collection.insert_one(new_task)
  if result.inserted_id: 
    new_task["id"] = str(result.inserted_id)
    return Task(**new_task)
  return None
    

async def update_task(id: str, updated_data: TaskUpdate, db: AsyncIOMotorDatabase):
  from app.services.taskService.autoScheduler import find_optimal_time
  from app.services.taskService.rescheduler import reschedule_overdue_tasks

  # Get existing task
  existing_task = await get_task_by_id(id, db)
  if not existing_task:
    return None, None

  # Check if updated fields related to the smart scheduling feature
  existing_data_dict = existing_task.model_dump(by_alias=True)
  updated_data_dict = updated_data.model_dump(by_alias=True)

  fields = ["duration", "start_date", "due_date", "split"]
  updated_fields = []
  if existing_data_dict["smart_scheduling"] and updated_data_dict["smart_scheduling"]:
    updated_fields = [field for field in fields if existing_data_dict[field] != updated_data_dict[field]]

  # Recalculate optimal time
  if updated_fields and updated_data_dict["smart_scheduling"]:
    print(updated_fields)
    updated_data_dict["id"] = id
    time_allocations = await find_optimal_time(Task(**updated_data_dict), db)

    if time_allocations:
      updated_data.time_allocations = time_allocations

  # Update task
  updated_task = await db.task_collection.find_one_and_update(
    filter={"_id": ObjectId(id)}, 
    update={"$set": updated_data.model_dump(by_alias=True)}, 
    return_document=ReturnDocument.AFTER
  )
  if updated_task:
    # Get overdue tasks rescheduled successfully 
    updated_data_list = await reschedule_overdue_tasks(db)

    if updated_data_list: # Update data in Mongodb
      for data in updated_data_list:
        await db.task_collection.find_one_and_update(
          filter={"_id": ObjectId(data["id"])}, 
          update={"$set": Task(**data).model_dump(by_alias=True)}
        )

    return Task(**updated_task), updated_data_list
  return None, None


async def delete_task(id: str, db: AsyncIOMotorDatabase):
  from app.services.taskService.rescheduler import reschedule_overdue_tasks

  deleted_task = await db.task_collection.find_one_and_delete(filter={"_id": ObjectId(id)})

  if deleted_task:
    # Get overdue tasks rescheduled successfully 
    updated_data_list = await reschedule_overdue_tasks(db)
    
    if updated_data_list: # Update data in Mongodb
      for data in updated_data_list:
        await db.task_collection.find_one_and_update(
          filter={"_id": ObjectId(data["id"])}, 
          update={"$set": Task(**data).model_dump(by_alias=True)}
        )

    return Task(**deleted_task), updated_data_list
  return None, None