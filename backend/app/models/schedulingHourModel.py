from datetime import datetime
from typing import Any, List, Optional

from beanie import Document
from pydantic import BaseModel, field_validator, model_validator

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
	updated_at: Optional[datetime] = None

	@model_validator(mode="after")
	@classmethod
	def add_timezone(cls, data: Any):
		if data.created_at and not data.created_at.tzinfo:
			data.created_at = add_utc_timezone(data.created_at)
		if data.updated_at and not data.updated_at.tzinfo:
			data.updated_at = add_utc_timezone(data.updated_at)
		return data

	class Settings:
		name = "scheduling_hour_collection"
