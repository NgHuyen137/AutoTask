from typing import Annotated
from fastapi import APIRouter, Depends, Response, status

from app.dependencies.auth import get_current_user
from app.exceptions.taskExceptions import TaskNotFoundError
from app.models.userModel import User
from app.schemas.taskSchema import TaskCreate, TaskUpdate, TaskFilter
from app.services.taskService.crud import (
  create_task,
  delete_task,
  get_task_by_id,
  get_tasks,
  update_task,
)

task_router = APIRouter()


@task_router.get("/tasks/{id}")
async def get_single_task(
  id: str, current_user: Annotated[User, Depends(get_current_user)]
):
  task = await get_task_by_id(id)
  if task:
    return task
  raise TaskNotFoundError()


@task_router.get("/tasks")
async def get_all_tasks(
  current_user: Annotated[User, Depends(get_current_user)],
  filters: TaskFilter = Depends(),
):
  tasks = await get_tasks(filters)
  if tasks:
    return tasks
  raise TaskNotFoundError()


@task_router.post("/tasks")
async def create_single_task(
  response: Response,
  task: TaskCreate,
  current_user: Annotated[User, Depends(get_current_user)],
):
  new_task = await create_task(task)
  if new_task:
    response.status_code = status.HTTP_201_CREATED
    return new_task


@task_router.put("/tasks/{id}")
async def update_single_task(
  id: str,
  updated_data: TaskUpdate,
  current_user: Annotated[User, Depends(get_current_user)],
):
  updated_task, updated_overdue_tasks = await update_task(id, updated_data)
  if updated_task:
    return {
      "updated_task": updated_task,
      "updated_overdue_tasks": updated_overdue_tasks,
    }

  raise TaskNotFoundError()


@task_router.delete("/tasks/{id}")
async def delete_single_task(
  id: str, current_user: Annotated[User, Depends(get_current_user)]
):
  deleted_task, updated_overdue_tasks = await delete_task(id)
  if deleted_task:
    return {
      "deleted_task": deleted_task,
      "updated_overdue_tasks": updated_overdue_tasks,
    }

  raise TaskNotFoundError()
