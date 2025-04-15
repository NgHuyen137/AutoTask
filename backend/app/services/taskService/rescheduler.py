from typing import Optional

from beanie import PydanticObjectId
from beanie.operators import NE, ElemMatch, Eq

from app.models.taskModel import Task
from app.services.taskService.autoScheduler import find_optimal_time
from app.utils.datetime import get_utc_now


async def fetch_overdue_tasks(updated_task_id: Optional[PydanticObjectId] = None):
	"""
	Fetch tasks that are not scheduled on time
	"""
	overdue_tasks = await Task.find(
		NE(Task.id, updated_task_id),
		ElemMatch(Task.time_allocations, Eq("is_scheduled_ontime", False)),
	).to_list()

	sorted_overdue_tasks = []  # Recalculate the overdue task with earlier due date
	if overdue_tasks:
		sorted_overdue_tasks = sorted(overdue_tasks, key=lambda x: x.due_date)
	return sorted_overdue_tasks


async def reschedule_overdue_tasks(updated_task_id: Optional[PydanticObjectId] = None):
	"""
	Reschedule overdue tasks when there are free slots after deleting/updating a task
	"""
	overdue_tasks = await fetch_overdue_tasks(updated_task_id)
	if not overdue_tasks:  # Check if there are overdue tasks
		return []

	updated_overdue_tasks = []
	for overdue_task in overdue_tasks:
		rescheduled_time_allocations = await find_optimal_time(
			overdue_task, overdue_task.id
		)
		overdue_task.time_allocations = rescheduled_time_allocations
		overdue_task.updated_at = get_utc_now()
		updated_overdue_tasks.append(overdue_task)

	return updated_overdue_tasks
