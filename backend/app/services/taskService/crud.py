from beanie import PydanticObjectId

from app.models.taskModel import Task
from app.schemas.taskSchema import TaskCreate, TaskUpdate


async def get_task_by_id(id: str):
	task = await Task.get(id)
	if task:
		return task
	return None


async def get_tasks(start_of_week: str, end_of_week: str):
	results = await Task.aggregate(
		[
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
			{"$match": {"task_start_at": {"$gte": start_of_week, "$lte": end_of_week}}},
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
	).to_list()

	if results:
		tasks = []
		for task in results:
			task["id"] = task.pop("_id")
			tasks.append(Task(**task))
		return tasks
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

	# Check if updated fields related to the smart scheduling feature
	existing_data_dict = existing_task.model_dump()
	updated_data_dict = updated_data.model_dump()

	# Recalculate optimal time if these fields change
	fields = ["duration", "start_date", "due_date", "split", "scheduling_hour_id"]
	updated_fields = []
	if existing_data_dict["smart_scheduling"] and updated_data_dict["smart_scheduling"]:
		# Select changed fields
		for field in fields:
			old = existing_data_dict[field]
			new = updated_data_dict[field]
			if not old and not new:
				continue
			if old != new or (not old and new) or (old and not new):
				updated_fields.append(field)

	# Recalculate optimal time
	if (updated_fields and updated_data_dict["smart_scheduling"]) or (
		not existing_data_dict["smart_scheduling"] and updated_data_dict["smart_scheduling"]
	):
		time_allocations = await find_optimal_time(updated_data, PydanticObjectId(id))
		if time_allocations:
			updated_data_dict["time_allocations"] = time_allocations

	# Update task in MongoDB
	updated_data_dict["id"] = id  # Add id to updated data
	updated_task = Task(**updated_data_dict)
	await updated_task.save()

	# If there are overdue tasks, reschedule them
	if updated_task:
		# Get overdue tasks rescheduled successfully
		updated_overdue_tasks = await reschedule_overdue_tasks(updated_task.id)

		if updated_overdue_tasks:  # Update data in Mongodb
			for updated_overdue_task in updated_overdue_tasks:
				await updated_overdue_task.save()

		return updated_task, updated_overdue_tasks
	return None, None


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
