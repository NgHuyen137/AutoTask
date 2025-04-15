from app.models.schedulingHourModel import SchedulingHour
from app.schemas.schedulingHourSchema import SchedulingHourCreate
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
