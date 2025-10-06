from enum import Enum, IntEnum


class Status(IntEnum):
  NOT_COMPLETED = 0
  COMPLETED = 1


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


class RangeType(str, Enum):
  START_DATE = "start_date"
  DUE_DATE = "due_date"


class SortBy(str, Enum):
  START_DATE = "start_date"
  DUE_DATE = "due_date"
  PRIORITY = "priority"
  STATUS = "status"


class SortOrder(str, Enum):
  ASC = "asc"
  DESC = "desc"
