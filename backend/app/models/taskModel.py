from datetime import datetime, timezone
from enum import Enum, IntEnum
from typing import Optional, List, Any
from pydantic import BaseModel, Field, model_validator, field_validator
from app.utils.mongodb import PyObjectId
from app.utils.datetime import tz, add_utc_timezone

class Status(IntEnum):
    NOT_STARTED = 0
    IN_PROGRESS = 1
    COMPLETED = 2

class Priority(IntEnum):
    ASAP = 3
    HIGH = 2
    MEDIUM = 1
    LOW = 0

class TimeUnit(str, Enum):
    MINUTES = "minutes"
    HOURS = "hours"
    DAYS = "days"
    WEEKS = "weeks"

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

class Task(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    scheduling_hour_id: Optional[PyObjectId] = None
    smart_scheduling: bool = False
    name: str
    status: Status = Status.NOT_STARTED
    priority: Priority = Priority.MEDIUM
    tags: Optional[List[Tag]] = None
    description: Optional[str] = None
    duration: Optional[Duration] = None 
    split: Optional[Split] = None 
    start_date: Optional[datetime] = None 
    due_date: Optional[datetime] = None
    time_allocations: Optional[List[TimeBlock]] = None
    created_at: datetime = datetime.now(tz=tz).astimezone(tz=timezone.utc).replace(second=0, microsecond=0)
    updated_at: Optional[datetime] = None

    @model_validator(mode="before")
    @classmethod
    def check_smart_scheduling_enabled(cls, data: Any):
        if "smart_scheduling" not in data:
            data["smart_scheduling"] = False
        if data["smart_scheduling"] and ("scheduling_hour_id" not in data or not data["scheduling_hour_id"]):
            raise ValueError("The preferred scheduling hours for the task are required!")
        if not (data["smart_scheduling"] or "time_allocations" in data):
            raise ValueError("The scheduled time of the task is required!")
        if data["smart_scheduling"] and "duration" not in data:
            raise ValueError("The duration of the task is required!")
        if data["smart_scheduling"] and "start_date" not in data:
            data["start_date"] = datetime.now(tz=tz).astimezone(tz=timezone.utc).replace(second=0, microsecond=0)
        if data["smart_scheduling"] and "due_date" not in data:
            raise ValueError("The due date of the task is required!")
        return data
    
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

class TaskUpdate(BaseModel):
    scheduling_hour_id: Optional[PyObjectId] = None
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
    updated_at: datetime = datetime.now(tz=tz).astimezone(tz=timezone.utc).replace(second=0, microsecond=0)

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