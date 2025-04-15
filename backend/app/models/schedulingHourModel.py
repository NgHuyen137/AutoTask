from datetime import datetime
from typing import List, Optional

from beanie import Document
from pydantic import BaseModel, field_validator

from app.utils.datetime import add_utc_timezone


class TimeFrame(BaseModel):
	start_at: datetime
	end_at: datetime

	@field_validator("start_at", "end_at", mode="before")
	@classmethod
	def add_timezone(cls, value):
		if isinstance(value, datetime):
			return add_utc_timezone(value)
		return value


class DayOfWeek(BaseModel):
	day_index: int
	time_frames: List[TimeFrame]


class SchedulingHour(Document):
	name: str
	description: Optional[str] = None
	days_of_week: List[DayOfWeek]
	created_at: datetime

	@field_validator("created_at", mode="after")
	@classmethod
	def add_timezone(cls, value: datetime):
		if value and not value.tzinfo:
			value = add_utc_timezone(value)
		return value

	class Settings:
		name = "scheduling_hour_collection"
