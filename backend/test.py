from app.utils.datetime import tz
from datetime import timezone, datetime

vn_time = datetime(2025, 2, 9, 7, tzinfo=tz)
utc_time = vn_time.astimezone(tz=timezone.utc)
print(utc_time)