import copy
from datetime import date, datetime, timedelta, timezone
from typing import Dict, List, Optional

from beanie import PydanticObjectId

from app.models.schedulingHourModel import SchedulingHour, TimeFrame
from app.models.taskModel import Split, Task
from app.schemas.taskSchema import TaskCreate, TaskUpdate
from app.utils.datetime import add_utc_timezone


def get_preferred_datetimes(
	day: date, start_date: datetime, mapping: Dict[int, List[TimeFrame]]
):
	"""
	Get preferred time frames on a specific day to schedule a task
	"""
	datetimes = []

	day_index = day.weekday()
	if day_index in list(mapping.keys()):  # Check if day is a preferred day
		for time_frame in mapping[day_index]:
			# The start_date is between the time frame
			if (
				day == start_date.date()
				and start_date.time() > time_frame.start_at.time()
				and start_date.time() < time_frame.end_at.time()
			):
				datetimes.append(
					{
						"start_at": datetime.combine(day, start_date.time(), tzinfo=timezone.utc),
						"end_at": datetime.combine(
							day, time_frame.end_at.time(), tzinfo=timezone.utc
						),
					}
				)

			# The preferred time frame is before start_date
			elif (
				day == start_date.date() and start_date.time() >= time_frame.end_at.time()
			) or (day < start_date.date()):
				pass

				# The examined day is greater than start_date OR
			# The examined day is start_date and before the time frame
			else:
				datetimes.append(
					{
						"start_at": datetime.combine(
							day, time_frame.start_at.time(), tzinfo=timezone.utc
						),
						"end_at": datetime.combine(
							day, time_frame.end_at.time(), tzinfo=timezone.utc
						),
					}
				)

	return datetimes


async def fetch_scheduled_blocks(
	datetimes: List[Dict[str, datetime]], id: Optional[PydanticObjectId] = None
):
	"""
	Fetch all scheduled blocks that overlap preferred time frames to retain free slots
	"""
	condition_query = []  # A query to get all tasks overlapping preferred datetimes

	# Loop through each preferred time frame
	for dt in datetimes:
		# Tasks not end before or start after a preferred datetime
		condition_query.append(
			{
				"$and": [
					{"$lt": ["$$time_block.start_at", dt["end_at"]]},
					{"$gt": ["$$time_block.end_at", dt["start_at"]]},
				]
			}
		)

	pipeline = []
	if id:  # Exclude the document whose _id is equal to the given id.
		pipeline.append({"$match": {"_id": {"$ne": id}}})

	pipeline.append(
		{
			"$project": {
				"_id": 0,
				"scheduled_blocks": {
					"$filter": {
						"input": "$time_allocations",
						"as": "time_block",
						"cond": {"$or": condition_query},
					}
				},
			}
		}
	)

	results = await Task.aggregate(pipeline).to_list()

	# Datetime fetched from MongoDB is naive => Convert naive datetime to UTC timezone
	scheduled_blocks = []
	naive_scheduled_blocks = []
	if results:
		for item in results:
			naive_scheduled_blocks.extend(item["scheduled_blocks"])
		for scheduled_block in naive_scheduled_blocks:
			scheduled_block["start_at"] = add_utc_timezone(scheduled_block["start_at"])
			scheduled_block["end_at"] = add_utc_timezone(scheduled_block["end_at"])
			scheduled_blocks.append(scheduled_block)

	return scheduled_blocks


def find_free_slots(
	scheduled_blocks: List[Dict[str, datetime]], datetimes: List[Dict[str, datetime]]
):
	"""
	Find free slots given lists of overlapped scheduled blocks and preferred datetimes
	"""
	sorted_blocks = sorted(scheduled_blocks, key=lambda x: x["start_at"])

	# Combine overlapped scheduled blocks into one scheduled block
	deleted_indices = []
	for i in range(len(sorted_blocks) - 1):
		if (
			sorted_blocks[i]["end_at"] > sorted_blocks[i + 1]["start_at"]
			and sorted_blocks[i]["end_at"] <= sorted_blocks[i + 1]["end_at"]
		):
			sorted_blocks[i]["end_at"] = sorted_blocks[i + 1]["end_at"]
			deleted_indices.append(i + 1)

		if sorted_blocks[i]["end_at"] > sorted_blocks[i + 1]["end_at"]:
			deleted_indices.append(i + 1)

	if deleted_indices:
		sorted_blocks = [
			block for i, block in enumerate(sorted_blocks) if i not in deleted_indices
		]

	# Find free time slots
	free_slots = []
	for dt in datetimes:
		# Check if there are scheduled blocks overlap dt
		blocks_overlap_dt = [
			block
			for block in sorted_blocks
			if block["start_at"] < dt["end_at"] and block["end_at"] > dt["start_at"]
		]
		if not blocks_overlap_dt:
			free_slots.append(dt)
			continue

		blocks_overlap_dt.insert(0, {"start_at": dt["start_at"], "end_at": dt["start_at"]})

		blocks_overlap_dt.append({"start_at": dt["end_at"], "end_at": dt["end_at"]})

		for i in range(len(blocks_overlap_dt) - 1):
			if blocks_overlap_dt[i]["end_at"] < blocks_overlap_dt[i + 1]["start_at"]:
				free_slots.append(
					{
						"start_at": blocks_overlap_dt[i]["end_at"],
						"end_at": blocks_overlap_dt[i + 1]["start_at"],
					}
				)

	return free_slots


async def calculate_free_slots(
	day: date,
	start_date: datetime,
	mapping: Dict[int, List[TimeFrame]],
	task_id: Optional[PydanticObjectId] = None,
):
	"""
	Calculate free slots on a specific day to schedule a task
	"""
	free_slots = []
	datetimes = get_preferred_datetimes(day, start_date, mapping)
	if datetimes:  # The current day is one of the preferred days
		scheduled_blocks = await fetch_scheduled_blocks(datetimes, task_id)
		if scheduled_blocks:  # Find remaining free slots
			free_slots = find_free_slots(scheduled_blocks, datetimes)
		else:  # There are no tasks scheduled on that day
			free_slots = datetimes

	return free_slots


def find_fitting_slot(
	duration: timedelta,
	free_slots: List[Dict[str, datetime]],
):
	"""
	Find a free time slot to assign the task completely
	"""
	deleted_idx = None
	fitting_slot = dict()

	for i in range(len(free_slots)):
		slot_interval = free_slots[i]["end_at"] - free_slots[i]["start_at"]
		if slot_interval >= duration:
			fitting_slot["start_at"] = free_slots[i]["start_at"]
			fitting_slot["end_at"] = fitting_slot["start_at"] + duration

			if slot_interval == duration:
				deleted_idx = i
			if slot_interval > duration:
				free_slots[i]["start_at"] = fitting_slot["end_at"]
			break

	if deleted_idx:
		del free_slots[deleted_idx]

	return fitting_slot


def find_split_slots(
	split: Split,
	duration: timedelta,
	due_date: datetime,
	free_slots: List[Dict[str, datetime]],
):
	"""
	Assign the task to appropriate time slots
	"""
	time_allocations = []

	remaining_duration = duration

	deleted_indices = []

	for i in range(len(free_slots)):
		slot_interval = free_slots[i]["end_at"] - free_slots[i]["start_at"]

		if remaining_duration != timedelta(0) and slot_interval >= split.min_duration:
			assigned_slot = {}
			if slot_interval <= remaining_duration:
				assigned_slot = {
					"start_at": free_slots[i]["start_at"],
					"end_at": free_slots[i]["end_at"],
				}
				deleted_indices.append(i)

			if slot_interval > remaining_duration:
				assigned_slot = {
					"start_at": free_slots[i]["start_at"],
					"end_at": free_slots[i]["start_at"] + remaining_duration,
				}
				free_slots[i]["start_at"] = assigned_slot["end_at"]

			if assigned_slot["end_at"] > due_date:
				assigned_slot["is_scheduled_ontime"] = False

			if assigned_slot["end_at"] <= due_date:
				assigned_slot["is_scheduled_ontime"] = True

			time_allocations.append(assigned_slot)
			remaining_duration -= assigned_slot["end_at"] - assigned_slot["start_at"]
		if remaining_duration == timedelta(0):
			break

	free_slots = [
		free_slot for i, free_slot in enumerate(free_slots) if i not in deleted_indices
	]

	return remaining_duration, time_allocations, free_slots


async def find_optimal_time(
	task: Task | TaskCreate | TaskUpdate, task_id: Optional[PydanticObjectId] = None
):
	"""
	Find time slots that align with the user's preferred schedule.
	"""
	scheduling_hour = await SchedulingHour.get(task.scheduling_hour_id)
	if scheduling_hour:
		# Construct day index - time mapping
		mapping = {}
		for day in scheduling_hour.days_of_week:
			mapping[day.day_index] = day.time_frames

		start_date = task.start_date
		due_date = task.due_date

		# Convert duration to timedelta
		converted_duration = timedelta(
			hours=task.duration.hours, minutes=task.duration.minutes
		)

		# Convert min duration to timedelta
		converted_split = None
		if task.split:
			converted_split = copy.deepcopy(task.split)
			converted_split.min_duration = timedelta(
				hours=converted_split.min_duration.hours,
				minutes=converted_split.min_duration.minutes,
			)

		# Check if there is a slot to assign full task
		total_time_allocations = []
		free_slots = []

		day = start_date.date()  # Find slots from the start date
		while True:  # Loop through each day until finding an empty slot
			free_slots = await calculate_free_slots(day, start_date, mapping, task_id)
			if free_slots:
				fitting_slot = find_fitting_slot(converted_duration, free_slots)
				if fitting_slot:
					if (
						not task.split and fitting_slot["end_at"] > due_date
					):  # Cannot schedule full task on time when split is not allowed
						fitting_slot["is_scheduled_ontime"] = False  # For showing overdue tasks
					if fitting_slot["end_at"] <= due_date:
						fitting_slot["is_scheduled_ontime"] = True
					if (
						task.split and fitting_slot["end_at"] > due_date
					):  # Split task if assigning full task is not possible
						break
					total_time_allocations.append(fitting_slot)
					return total_time_allocations

					# Early break if the task is allowed to split and the due date is today
				if not fitting_slot and task.split and day == due_date.date():
					break

			day += timedelta(days=1)

		# Split a long task into smaller tasks
		if task.split:
			day = start_date.date()
			remaining_duration = converted_duration
			while True:
				free_slots = await calculate_free_slots(day, start_date, mapping, task_id)
				if free_slots:
					remaining_duration, time_allocations, _ = find_split_slots(
						converted_split, remaining_duration, due_date, free_slots
					)

					if time_allocations:
						total_time_allocations.extend(time_allocations)

					if remaining_duration == timedelta(0):
						return total_time_allocations

				day += timedelta(days=1)
