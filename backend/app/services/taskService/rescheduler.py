import copy
from typing import List, Dict, Any
from datetime import timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.taskModel import Duration
from app.services.taskService.crud import get_task_by_id
from app.services.taskService.autoScheduler import find_optimal_time
from app.utils.datetime import add_utc_timezone


async def fetch_overdue_time_blocks(db: AsyncIOMotorDatabase):
    '''
        Fetch overdue time blocks with due dates greater than or equal to the deleted task's end time
    '''
    results = await db.task_collection.aggregate([
        {
            "$project": {
                "_id": 1,
                "due_date": 1,
                "overdue_time_blocks": {  
                    "$filter": {
                        "input": {"$ifNull": ["$time_allocations", []]},
                        "as": "time_block",
                        "cond": {"$eq": [{"$ifNull": ["$$time_block.is_scheduled_ontime", True]}, False]}
                    }
                }
            }
        }
    ]).to_list(length=None)

    sorted_docs = []
    if results:
        # Exclude None due date and None overdue_time_blocks
        # and convert naive datetime to utc timezone
        docs = []
        for doc in results:
            if doc["overdue_time_blocks"]:
                doc["due_date"] = add_utc_timezone(doc["due_date"])
                for overdue_time_block in doc["overdue_time_blocks"]:
                    overdue_time_block["start_at"] = add_utc_timezone(overdue_time_block["start_at"])
                    overdue_time_block["end_at"] = add_utc_timezone(overdue_time_block["end_at"])
                docs.append(doc)
        
        if docs:
          sorted_docs = sorted(docs, key=lambda x: x["due_date"])
    return sorted_docs


def get_new_time_blocks(
    rescheduled_time_allocations: List[Dict[str, Any]],
    overdue_time_allocation: Dict[str, Any]
):
    '''
        Get new time for an overdue time block
    '''
    new_time_allocations = []
    overdue_duration = overdue_time_allocation["end_at"] - overdue_time_allocation["start_at"]
    remaining_duration = overdue_duration

    for time_allocation in rescheduled_time_allocations:
        if time_allocation["is_scheduled_ontime"]:
            remaining_duration -= time_allocation["end_at"] - time_allocation["start_at"]
            new_time_allocations.append(time_allocation)

    if remaining_duration > timedelta(0) and remaining_duration < overdue_duration:
        new_time_allocations.append({
            "start_at": overdue_time_allocation["end_at"] - remaining_duration,
            "end_at": overdue_time_allocation["end_at"],
            "is_scheduled_ontime": False
        })

    return new_time_allocations


async def reschedule_overdue_tasks(db: AsyncIOMotorDatabase):  
    '''
        Reschedule overdue tasks when there are free slots after deleting/updating a task
    '''
    sorted_docs = await fetch_overdue_time_blocks(db)
    if not sorted_docs: # Check if there are overdue tasks
        return []
    
    updated_data_list = []
    for doc in sorted_docs:
        overdue_task = await get_task_by_id(doc["_id"], db)
        overdue_task_copy = copy.deepcopy(overdue_task)
        updated_data = overdue_task.model_dump(by_alias=True)       

        for overdue_time_block in doc["overdue_time_blocks"]:
            if len(overdue_task_copy.time_allocations) > 1:
                overdue_duration = overdue_time_block["end_at"] - overdue_time_block["start_at"]
            
                overdue_task_copy.duration = Duration(
                    hours=overdue_duration.total_seconds() // 3600,
                    minutes=(overdue_duration.total_seconds() % 3600) / 60
                )
            
            rescheduled_time_allocations = await find_optimal_time(overdue_task_copy, db)
            new_time_allocations = get_new_time_blocks(rescheduled_time_allocations, overdue_time_block)

            # Update task
            if new_time_allocations:
                index = updated_data["time_allocations"].index(overdue_time_block)
                del updated_data["time_allocations"][index]
                updated_data["time_allocations"].extend(new_time_allocations)

        updated_data["time_allocations"] = sorted(updated_data["time_allocations"], key=lambda x: x["start_at"])

        if updated_data != overdue_task.model_dump(by_alias=True):
            updated_data_list.append(updated_data)       
    return updated_data_list