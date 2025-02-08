from fastapi.responses import JSONResponse 
from fastapi import status, APIRouter, Depends, Response
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.database import Database
from app.models.taskModel import Task, TaskUpdate
from app.exceptions.taskExceptions import TaskNotFoundError, TaskAutoScheduleError
from app.services.taskService.autoScheduler import find_optimal_time
from app.services.taskService.crud import (
    get_task_by_id,
    get_all_tasks,
    create_task,
    update_task,
    delete_task
)

task_router = APIRouter()

@task_router.get("/tasks/{id}")
async def get_single_task(id: str, db: AsyncIOMotorDatabase = Depends(Database.get_db)):
    result = await get_task_by_id(id, db)
    if result:
        return result
    raise TaskNotFoundError()


@task_router.post("/tasks")
async def create_single_task(response: Response, task: Task, db: AsyncIOMotorDatabase = Depends(Database.get_db)):
    new_task = await create_task(task, db)
    if new_task:
        response.status_code = status.HTTP_201_CREATED
        return new_task
    

@task_router.put("/tasks/{id}")
async def update_single_task(id: str, updated_data: TaskUpdate, db: AsyncIOMotorDatabase = Depends(Database.get_db)):
    updated_task, updated_overdue_tasks = await update_task(id, updated_data, db)
    if updated_task:
        return {
            "message": "Task updated successfully!",
            "updated_task": updated_task.model_dump(),
            "updated_overdue_tasks": updated_overdue_tasks
        }
    
    raise TaskNotFoundError()


@task_router.delete("/tasks/{id}")
async def delete_single_task(id: str, db: AsyncIOMotorDatabase = Depends(Database.get_db)):
    deleted_task, updated_overdue_tasks = await delete_task(id, db)
    if deleted_task:
        return {
            "message": "Task deleted successfully!",
            "deleted_task": deleted_task.model_dump(),
            "updated_overdue_tasks": updated_overdue_tasks
        }
    
    raise TaskNotFoundError()