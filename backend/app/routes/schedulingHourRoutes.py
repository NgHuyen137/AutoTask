from fastapi import status, APIRouter, Depends, Response
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.database import Database
from app.models.schedulingHourModel import SchedulingHour
from app.services.schedulingHourService.crud import (
    get_scheduling_hour_by_id,
    create_scheduling_hour
) 

scheduling_hour_router = APIRouter()

@scheduling_hour_router.get("/schedulingHours/{id}")
async def get_single_scheduling_hour(id: str, db: AsyncIOMotorDatabase = Depends(Database.get_db)):
    scheduling_hour = await get_scheduling_hour_by_id(id, db)
    if scheduling_hour:
        return scheduling_hour
    raise 

@scheduling_hour_router.post("/schedulingHours")
async def create_single_scheduling_hour(
    response: Response,
    scheduling_hour: SchedulingHour, 
    db: AsyncIOMotorDatabase = Depends(Database.get_db),
):
    new_scheduling_hour = await create_scheduling_hour(scheduling_hour, db)
    if new_scheduling_hour:
        response.status_code = status.HTTP_201_CREATED
        return new_scheduling_hour