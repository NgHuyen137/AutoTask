from typing import Annotated, List
from fastapi import APIRouter, Depends, Response, status

from app.dependencies.auth import get_current_user
from app.exceptions.taskExceptions import TaskNotFoundError
from app.models.userModel import User
from app.schemas.taskSchema import (
  TaskCreate,
  TaskUpdate,
  TaskFilter,
  MultipleTasksUpdate,
  MultipleTasksDelete,
)
from app.services.taskService.crud import (
  create_task,
  delete_task,
  get_task_by_id,
  get_tasks,
  update_task,
  update_multiple_tasks,
  delete_multiple_tasks,
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
  results = await get_tasks(filters)
  if results:
    return results
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


@task_router.put("/tasks/bulk-update")
async def update_tasks(
  request: MultipleTasksUpdate, current_user: Annotated[User, Depends(get_current_user)]
):
  result = await update_multiple_tasks(request.ids, request.updated_data)
  if result > 0:
    return {"n_updated_tasks": result}
  raise TaskNotFoundError()


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


@task_router.delete("/tasks/bulk-deletion")
async def delete_tasks(
  request: MultipleTasksDelete, current_user: Annotated[User, Depends(get_current_user)]
):
  result = await delete_multiple_tasks(request.ids)
  return {"updated_overdue_tasks": result}


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
