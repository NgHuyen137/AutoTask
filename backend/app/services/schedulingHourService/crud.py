from app.models.schedulingHourModel import SchedulingHour
from app.schemas.schedulingHourSchema import SchedulingHourCreate, SchedulingHourUpdate
from app.utils.datetime import convert_day_of_week


async def get_scheduling_hours():
	scheduling_hours = await SchedulingHour.find().to_list()
	if scheduling_hours:
		return scheduling_hours
	return None


async def get_scheduling_hour_by_id(id: str):
	scheduling_hour = await SchedulingHour.get(id)
	return scheduling_hour


async def create_scheduling_hour(scheduling_hour: SchedulingHourCreate):
	scheduling_hour_dict = scheduling_hour.model_dump()

	# Convert Time objects to Datetime objects before storing in MongoDB
	converted_days_of_week = list(
		map(convert_day_of_week, scheduling_hour_dict["days_of_week"])
	)
	scheduling_hour_dict["days_of_week"] = converted_days_of_week

	new_scheduling_hour = SchedulingHour(**scheduling_hour_dict)
	await new_scheduling_hour.insert()

	if new_scheduling_hour.id:  # Check if the data has been created successfully
		return new_scheduling_hour
	return None


async def update_scheduling_hour(id: str, updated_data: SchedulingHourUpdate):
	scheduling_hour = await get_scheduling_hour_by_id(id)
	if not scheduling_hour:
		return None

	updated_data_dict = updated_data.model_dump()
	updated_data_dict["id"] = id

	# Convert Time objects to Datetime objects before storing in MongoDB
	if updated_data_dict.get("days_of_week"):
		converted_days_of_week = list(
			map(convert_day_of_week, updated_data_dict["days_of_week"])
		)
		updated_data_dict["days_of_week"] = converted_days_of_week

	updated_scheduling_hour = SchedulingHour(**updated_data_dict)
	await updated_scheduling_hour.save()

	return updated_scheduling_hour


async def delete_scheduling_hour(id: str):
	deleted_scheduling_hour = await SchedulingHour.get(id)
	if deleted_scheduling_hour:
		await deleted_scheduling_hour.delete()
		return deleted_scheduling_hour
	return None
