from typing import Annotated

from fastapi import APIRouter, Depends, Response, status

from app.dependencies.auth import get_current_user
from app.exceptions.schedulingHourExceptions import SchedulingHourNotFoundError
from app.models.userModel import User
from app.schemas.schedulingHourSchema import SchedulingHourCreate, SchedulingHourUpdate
from app.services.schedulingHourService.crud import (
	create_scheduling_hour,
	delete_scheduling_hour,
	get_scheduling_hour_by_id,
	get_scheduling_hours,
	update_scheduling_hour,
)

scheduling_hour_router = APIRouter()


@scheduling_hour_router.get("/schedulingHours")
async def get_all_scheduling_hours(
	current_user: Annotated[User, Depends(get_current_user)],
):
	scheduling_hours = await get_scheduling_hours()
	if scheduling_hours:
		return scheduling_hours
	raise SchedulingHourNotFoundError()


@scheduling_hour_router.get("/schedulingHours/{id}")
async def get_single_scheduling_hour(
	id: str, current_user: Annotated[User, Depends(get_current_user)]
):
	scheduling_hour = await get_scheduling_hour_by_id(id)
	if scheduling_hour:
		return scheduling_hour
	raise SchedulingHourNotFoundError()


@scheduling_hour_router.post("/schedulingHours")
async def create_single_scheduling_hour(
	response: Response,
	scheduling_hour: SchedulingHourCreate,
	current_user: Annotated[User, Depends(get_current_user)],
):
	new_scheduling_hour = await create_scheduling_hour(scheduling_hour)
	if new_scheduling_hour:
		response.status_code = status.HTTP_201_CREATED
		return new_scheduling_hour


@scheduling_hour_router.put("/schedulingHours")
async def update_single_scheduling_hour(
	id: str,
	updated_data: SchedulingHourUpdate,
	current_user: Annotated[User, Depends(get_current_user)],
):
	updated_scheduling_hour = await update_scheduling_hour(id, updated_data)
	if updated_scheduling_hour:
		return updated_scheduling_hour
	raise SchedulingHourNotFoundError()


@scheduling_hour_router.delete("/schedulingHours")
async def delete_single_scheduling_hour(
	id: str, current_user: Annotated[User, Depends(get_current_user)]
):
	deleted_scheduling_hour = await delete_scheduling_hour(id)
	if deleted_scheduling_hour:
		return deleted_scheduling_hour
	raise SchedulingHourNotFoundError()
