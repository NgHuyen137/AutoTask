from fastapi import APIRouter, Response, status

from app.exceptions.taskExceptions import TaskNotFoundError
from app.schemas.taskSchema import TaskCreate, TaskUpdate
from app.services.taskService.crud import (
	create_task,
	delete_task,
	get_task_by_id,
	get_tasks,
	update_task,
)

task_router = APIRouter()


@task_router.get("/tasks/{id}")
async def get_single_task(id: str):
	task = await get_task_by_id(id)
	if task:
		return task
	raise TaskNotFoundError()


@task_router.get("/tasks")
async def get_all_tasks(start_of_week: str, end_of_week: str):
	tasks = await get_tasks(start_of_week, end_of_week)
	if tasks:
		return tasks
	raise TaskNotFoundError()


@task_router.post("/tasks")
async def create_single_task(response: Response, task: TaskCreate):
	new_task = await create_task(task)
	if new_task:
		response.status_code = status.HTTP_201_CREATED
		return new_task


@task_router.put("/tasks/{id}")
async def update_single_task(id: str, updated_data: TaskUpdate):
	updated_task, updated_overdue_tasks = await update_task(id, updated_data)
	if updated_task:
		return {
			"updated_task": updated_task,
			"updated_overdue_tasks": updated_overdue_tasks,
		}

	raise TaskNotFoundError()


@task_router.delete("/tasks/{id}")
async def delete_single_task(id: str):
	deleted_task, updated_overdue_tasks = await delete_task(id)
	if deleted_task:
		return {
			"deleted_task": deleted_task,
			"updated_overdue_tasks": updated_overdue_tasks,
		}

	raise TaskNotFoundError()
