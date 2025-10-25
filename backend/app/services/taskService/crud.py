import math
from typing import List
from datetime import time, datetime
from beanie import PydanticObjectId

from app.models.taskModel import Task
from app.schemas.taskSchema import TaskCreate, TaskUpdate, TaskFilter


async def get_task_by_id(id: str):
  task = await Task.get(id)
  if task:
    return task
  return None


async def get_tasks(filters: TaskFilter):
  pipeline = []

  if filters.search:
    pipeline.append({"$match": {"$text": {"$search": filters.search}}})

  if filters.start_of_week and filters.end_of_week:
    pipeline = [
      {"$unwind": "$time_allocations"},
      {
        "$addFields": {
          "task_start_at": {
            "$dateToString": {
              "format": "%Y-%m-%d",
              "date": "$time_allocations.start_at",
            }
          }
        }
      },
      {
        "$match": {
          "task_start_at": {"$gte": filters.start_of_week, "$lte": filters.end_of_week}
        }
      },
      {
        "$group": {
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
          "time_allocations": {"$push": "$time_allocations"},
        }
      },
      {"$project": {"task_start_at": 0}},
    ]

  else:
    query = {}

    sort_field = (
      "used_due_date"
      if filters.sort_by == "due_date"
      else "used_start_date"
      if filters.sort_by == "start_date"
      else filters.sort_by
    )

    sort_order = 1 if filters.sort_order == "asc" else -1

    if filters.status is not None:
      query["status"] = filters.status
    if filters.priority is not None:
      query["priority"] = filters.priority
    if filters.tags:
      query["$or"] = [
        {"tags": {"$elemMatch": {"name": {"$regex": tag, "$options": "i"}}}}
        for tag in filters.tags.split(",")
      ]
    if filters.from_date and filters.to_date and filters.range_type:
      from_date = datetime.combine(filters.from_date, time(0, 0))
      to_date = datetime.combine(filters.to_date, time(23, 59, 59))
      if filters.range_type == "start_date":
        query["used_start_date"] = {"$gte": from_date, "$lte": to_date}
      else:
        query["used_due_date"] = {"$gte": from_date, "$lte": to_date}

    pipeline = [
      {
        "$addFields": {
          "used_start_date": {
            "$cond": {
              "if": "$smart_scheduling",
              "then": "$start_date",
              "else": {
                "$getField": {
                  "field": "start_at",
                  "input": {"$arrayElemAt": ["$time_allocations", 0]},
                }
              },
            }
          },
          "used_due_date": {
            "$cond": {
              "if": "$smart_scheduling",
              "then": "$due_date",
              "else": {
                "$getField": {
                  "field": "end_at",
                  "input": {"$arrayElemAt": ["$time_allocations", 0]},
                }
              },
            }
          },
        }
      },
      {"$match": query},
      {"$sort": {sort_field: sort_order}},
    ]

  # Get total count for pagination
  count_pipeline = pipeline.copy()
  count_pipeline.append({"$count": "total_tasks"})
  full_results = await Task.aggregate(count_pipeline).to_list()
  total_tasks = full_results[0]["total_tasks"] if full_results else 0
  total_pages = math.ceil(total_tasks / filters.limit)

  # Pagination
  skip = (filters.page - 1) * filters.limit
  pipeline.extend([{"$skip": skip}, {"$limit": filters.limit}])
  results = await Task.aggregate(pipeline).to_list()

  if results:
    tasks = []
    for task in results:
      task["id"] = task.pop("_id")
      tasks.append(Task(**task))
    return {"tasks": tasks, "total_pages": total_pages if total_pages > 0 else 1}
  return None


async def create_task(task: TaskCreate):
  from app.services.taskService.autoScheduler import find_optimal_time

  task_dict = task.model_dump()
  if task.smart_scheduling:
    time_allocations = await find_optimal_time(task)
    if time_allocations:
      task_dict["time_allocations"] = time_allocations

  new_task = Task(**task_dict)
  await new_task.insert()
  if new_task.id:
    return new_task
  return None


async def update_task(id: str, updated_data: TaskUpdate):
  from app.services.taskService.autoScheduler import find_optimal_time
  from app.services.taskService.rescheduler import reschedule_overdue_tasks

  # Get existing task
  existing_task = await get_task_by_id(id)
  if not existing_task:
    return None, None

  # Apply changes
  updated_data_dict = updated_data.model_dump(exclude_unset=True)
  existing_task = existing_task.model_copy(update=updated_data_dict)

  # Recalculate optimal time if any of these fields change
  fields = ["duration", "start_date", "due_date", "split", "scheduling_hour_id"]

  if (
    any(field in updated_data_dict for field in fields)
    and existing_task.smart_scheduling
  ):
    time_allocations = await find_optimal_time(
      Task(**existing_task.model_dump()), PydanticObjectId(id)
    )
    if time_allocations:
      updated_data_dict["time_allocations"] = time_allocations

  # Update task in MongoDB
  await existing_task.save()

  # If there are overdue tasks, reschedule them
  updated_overdue_tasks = await reschedule_overdue_tasks(existing_task.id)

  if updated_overdue_tasks:  # Update data in Mongodb
    for updated_overdue_task in updated_overdue_tasks:
      await updated_overdue_task.save()

  return existing_task, updated_overdue_tasks


async def update_multiple_tasks(ids: List[str], updated_data: TaskUpdate):
  # Update priority only
  collection = Task.get_motor_collection()
  object_ids = [PydanticObjectId(task_id) for task_id in ids]
  result = await collection.update_many(
    {"_id": {"$in": object_ids}}, {"$set": {"priority": updated_data.priority}}
  )
  return result.modified_count


async def delete_task(id: str):
  from app.services.taskService.rescheduler import reschedule_overdue_tasks

  deleted_task = await Task.get(id)
  await deleted_task.delete()

  if deleted_task:
    # Get overdue tasks rescheduled successfully
    updated_overdue_tasks = await reschedule_overdue_tasks()

    if updated_overdue_tasks:  # Update data in Mongodb
      for updated_overdue_task in updated_overdue_tasks:
        await updated_overdue_task.save()

    return deleted_task, updated_overdue_tasks
  return None, None


async def delete_multiple_tasks(ids: List[str]):
  from app.services.taskService.rescheduler import reschedule_overdue_tasks

  collection = Task.get_motor_collection()
  object_ids = [PydanticObjectId(task_id) for task_id in ids]
  result = await collection.delete_many({"_id": {"$in": object_ids}})

  if result.deleted_count > 0:
    # Get overdue tasks rescheduled successfully
    updated_overdue_tasks = await reschedule_overdue_tasks()

    if updated_overdue_tasks:  # Update data in Mongodb
      for updated_overdue_task in updated_overdue_tasks:
        await updated_overdue_task.save()

    return updated_overdue_tasks
  return None
