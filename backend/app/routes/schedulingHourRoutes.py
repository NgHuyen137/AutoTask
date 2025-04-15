from typing import List

from fastapi import APIRouter, Response, status

from app.exceptions.schedulingHourExceptions import *
from app.models.schedulingHourModel import SchedulingHour
from app.schemas.schedulingHourSchema import SchedulingHourCreate
from app.services.schedulingHourService.crud import (
	create_scheduling_hour,
	get_scheduling_hour_by_id,
	get_scheduling_hours,
)

scheduling_hour_router = APIRouter()


@scheduling_hour_router.get("/schedulingHours", response_model=List[SchedulingHour])
async def get_all_scheduling_hours():
	scheduling_hours = await get_scheduling_hours()
	if scheduling_hours:
		return scheduling_hours
	raise SchedulingHourNotFoundError()


@scheduling_hour_router.get("/schedulingHours/{id}", response_model=SchedulingHour)
async def get_single_scheduling_hour(id: str):
	scheduling_hour = await get_scheduling_hour_by_id(id)
	if scheduling_hour:
		return scheduling_hour
	raise SchedulingHourNotFoundError()


@scheduling_hour_router.post("/schedulingHours", response_model=SchedulingHour)
async def create_single_scheduling_hour(
	response: Response, scheduling_hour: SchedulingHourCreate
):
	new_scheduling_hour = await create_scheduling_hour(scheduling_hour)
	if new_scheduling_hour:
		response.status_code = status.HTTP_201_CREATED
		return new_scheduling_hour
