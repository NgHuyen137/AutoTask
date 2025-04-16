from datetime import datetime, time
from enum import IntEnum
from typing import List, Optional

from pydantic import BaseModel, Field

from app.utils.datetime import get_utc_now, tz


class DayOfWeekEnum(IntEnum):
	MONDAY = 0
	TUESDAY = 1
	WEDNESDAY = 2
	THURSDAY = 3
	FRIDAY = 4
	SATURDAY = 5
	SUNDAY = 6


class TimeFrame(BaseModel):
	start_at: time = time(9, 0, tzinfo=tz)
	end_at: time = time(17, 0, tzinfo=tz)


class DayOfWeek(BaseModel):
	day_index: int
	time_frames: List[TimeFrame] = Field(default_factory=lambda: [TimeFrame()])


def default_days_of_week():
	return [
		DayOfWeek(day_index=i)
		for i in range(DayOfWeekEnum.SATURDAY)  # From Monday to Friday
	]


class SchedulingHourCreate(BaseModel):
	name: str
	description: Optional[str] = None
	days_of_week: List[DayOfWeek]
	created_at: datetime = Field(default_factory=get_utc_now)


class SchedulingHourUpdate(BaseModel):
	name: str
	description: Optional[str] = None
	days_of_week: List[DayOfWeek] = Field(default_factory=default_days_of_week)
	created_at: datetime
	updated_at: datetime = Field(default_factory=get_utc_now)
