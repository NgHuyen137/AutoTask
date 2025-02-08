from datetime import time, datetime, timezone
from enum import IntEnum
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator
from app.utils.mongodb import PyObjectId
from app.utils.datetime import tz, add_utc_timezone

class DayOfWeekEnum(IntEnum):
    MONDAY = 0
    TUESDAY = 1
    WEDNESDAY = 2
    THURSDAY = 3
    FRIDAY = 4

class TimeFrame(BaseModel):
    start_at: time = time(9, 0)
    end_at: time = time(17, 0)

    # After fetching time frames from Mongodb, convert them to time
    @field_validator("start_at", "end_at", mode="before")
    @classmethod
    def add_timezone(cls, value: datetime):
        if isinstance(value, datetime):
            return add_utc_timezone(value).time()
        return value
        
class DayOfWeek(BaseModel):
    day_index: int
    time_frames: List[TimeFrame] = Field(default_factory=lambda: [TimeFrame()])

def default_days_of_week():
    return [
        DayOfWeek(day_index=i) for i in range(DayOfWeekEnum.FRIDAY) # From Monday to Friday
    ]

class SchedulingHour(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    description: Optional[str] = None
    days_of_week: List[DayOfWeek] = Field(default_factory=default_days_of_week)
    created_at: datetime = datetime.now(tz=tz).astimezone(tz=timezone.utc).replace(second=0, microsecond=0)
    updated_at: Optional[datetime] = None

    @field_validator("created_at", "updated_at", mode="after")
    @classmethod
    def add_timezone(cls, value: datetime):
        if value and not value.tzinfo: 
            value = add_utc_timezone(value)
        return value