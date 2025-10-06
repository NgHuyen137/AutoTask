from datetime import date, datetime
from typing import Any, List, Optional

from beanie import PydanticObjectId
from pydantic import BaseModel, Field, field_validator, model_validator

from app.types.taskTypes import Priority, Status, RangeType, SortOrder, SortBy
from app.utils.datetime import add_utc_timezone, get_utc_now


class Tag(BaseModel):
  name: str
  is_preferred: bool = False


class TimeBlock(BaseModel):
  start_at: datetime
  end_at: datetime
  is_scheduled_ontime: bool = True

  @field_validator("start_at", "end_at", mode="after")
  @classmethod
  def add_timezone(cls, value: datetime):
    if not value.tzinfo:
      return add_utc_timezone(value)
    return value


class Duration(BaseModel):
  hours: int
  minutes: int


class Split(BaseModel):
  min_duration: Duration


class TaskFilter(BaseModel):
  start_of_week: Optional[str] = None
  end_of_week: Optional[str] = None
  search: Optional[str] = None
  status: Optional[Status] = None
  priority: Optional[Priority] = None
  tags: Optional[str] = None
  range_type: Optional[RangeType] = None
  from_date: Optional[date] = None
  to_date: Optional[date] = None
  sort_by: SortBy = "due_date"
  sort_order: SortOrder = "asc"
  page: int = Field(default=1, ge=1)
  limit: int = Field(default=10, ge=1, le=100)


class TaskCreate(BaseModel):
  scheduling_hour_id: Optional[PydanticObjectId] = None
  smart_scheduling: bool = False
  name: str
  status: Status = Status.NOT_COMPLETED
  priority: Priority = Priority.MEDIUM
  tags: Optional[List[Tag]] = None
  description: Optional[str] = None
  duration: Optional[Duration] = None
  split: Optional[Split] = None
  start_date: Optional[datetime] = None
  due_date: Optional[datetime] = None
  time_allocations: Optional[List[TimeBlock]] = None
  created_at: datetime = Field(default_factory=get_utc_now)

  @model_validator(mode="after")
  @classmethod
  def add_timezone(cls, data: Any):
    if data.start_date and not data.start_date.tzinfo:
      data.start_date = add_utc_timezone(data.start_date)
    if data.due_date and not data.due_date.tzinfo:
      data.due_date = add_utc_timezone(data.due_date)
    if data.created_at and not data.created_at.tzinfo:
      data.created_at = add_utc_timezone(data.created_at)
    return data


class TaskUpdate(BaseModel):
  scheduling_hour_id: Optional[PydanticObjectId] = None
  smart_scheduling: bool = False
  name: str
  status: Status
  priority: Priority
  tags: Optional[List[Tag]] = None
  description: Optional[str] = None
  duration: Optional[Duration] = None
  split: Optional[Split] = None
  start_date: Optional[datetime] = None
  due_date: Optional[datetime] = None
  time_allocations: Optional[List[TimeBlock]] = None
  created_at: datetime
  updated_at: datetime = Field(default_factory=get_utc_now)

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
