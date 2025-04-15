from datetime import datetime
from typing import Any, List, Optional

from beanie import Document, PydanticObjectId
from pydantic import model_validator

from app.schemas.taskSchema import Duration, Priority, Split, Status, Tag, TimeBlock
from app.utils.datetime import add_utc_timezone


class Task(Document):
	scheduling_hour_id: Optional[PydanticObjectId] = None
	smart_scheduling: bool
	name: str
	status: Status = Status.NOT_COMPLETED
	priority: Priority = Priority.MEDIUM
	tags: Optional[List[Tag]] = None
	description: Optional[str] = None
	duration: Optional[Duration] = None
	split: Optional[Split] = None
	start_date: Optional[datetime] = None
	due_date: Optional[datetime] = None
	time_allocations: List[TimeBlock]
	created_at: datetime
	updated_at: Optional[datetime] = None

	@model_validator(mode="after")
	@classmethod
	def add_timezone(cls, data: Any):
		if data.start_date and not data.start_date.tzinfo:
			data.start_date = add_utc_timezone(data.start_date)
		if data.due_date and not data.due_date.tzinfo:
			data.due_date = add_utc_timezone(data.due_date)
		if data.created_at and not data.created_at.tzinfo:
			data.created_at = add_utc_timezone(data.created_at)
		if data.updated_at and not data.updated_at.tzinfo:
			data.updated_at = add_utc_timezone(data.updated_at)
		return data

	class Settings:
		name = "task_collection"
