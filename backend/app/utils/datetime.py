from datetime import time, date, datetime, timedelta, timezone

def get_timezone():
    local_tz = datetime.now().astimezone().tzinfo
    return local_tz

tz = get_timezone()

def get_utc_now():
    return datetime.now(tz=tz).astimezone(tz=timezone.utc).replace(second=0, microsecond=0)

def convert_time_to_datetime(time_object: time):
    '''
        Convert Time object to Datetime object
    '''
    datetime_object = datetime.combine(date.min, time_object, tzinfo=timezone.utc)

    if datetime_object.second or datetime_object.microsecond:
        datetime_object = datetime_object.replace(second=0, microsecond=0)
    return datetime_object

def convert_timeframe(time_frame):
    '''
        Convert start time & end time to Datetime objects before storing in MongoDB
    '''
    converted_start_at = convert_time_to_datetime(time_frame["start_at"])
    converted_end_at = convert_time_to_datetime(time_frame["end_at"])
    return {
        "start_at": converted_start_at,
        "end_at": converted_end_at
    }

def convert_day_of_week(day_of_week):
    '''
        Convert time frames in a day to Datetime objects
    '''
    return {
        "day_index": day_of_week["day_index"],
        "time_frames": list(map(convert_timeframe, day_of_week["time_frames"]))
    }

def add_utc_timezone(dt: datetime):
    '''
        Convert naive datetime to UTC timezone
    '''
    return dt.replace(tzinfo=timezone.utc)

def get_week_range(target_date: date):
    '''
        Return the start and end date of the week containing the target date
    '''
    start_of_week = target_date - timedelta(days=target_date.weekday())  # Monday
    end_of_week = start_of_week + timedelta(days=6)  # Sunday
    return start_of_week, end_of_week