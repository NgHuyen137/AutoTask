import dayjs from "dayjs"

export const matchSchedulingHour = (unmatchedSchedulingHour) => ({
  name: unmatchedSchedulingHour.name,
  description: unmatchedSchedulingHour.description,
  days_of_week: unmatchedSchedulingHour.daysOfWeek.map((day) => ({
    day_index: day.dayIndex,
    time_frames: day.timeFrames.map((timeFrame) => ({
      start_at: dayjs(timeFrame.startTime, "h:mm a").format("HH:mm:ssZ"),
      end_at: dayjs(timeFrame.endTime, "h:mm a").format("HH:mm:ssZ")
    }))
  }))
})

export const matchDaysOfWeek = (unmatchedDaysOfWeek) => unmatchedDaysOfWeek.map((day) => ({
  day_index: day.dayIndex,
  time_frames: day.timeFrames.map((timeFrame) => ({
    start_at: dayjs(timeFrame.startTime, "h:mm a").format("HH:mm:ssZ"),
    end_at: dayjs(timeFrame.endTime, "h:mm a").format("HH:mm:ssZ")
  }))
}))

export const matchDay = (unmatchedDay) => ({
  day_index: unmatchedDay.dayIndex,
  time_frames: unmatchedDay.timeFrames.map((timeFrame) => ({
    start_at: dayjs(timeFrame.startTime, "h:mm a").format("HH:mm:ssZ"),
    end_at: dayjs(timeFrame.endTime, "h:mm a").format("HH:mm:ssZ")
  }))
})

export const matchTimeFrame = (unmatchedTimeFrame) => ({
  start_at: dayjs(unmatchedTimeFrame.startTime, "h:mm a").format("HH:mm:ssZ"),
  end_at: dayjs(unmatchedTimeFrame.endTime, "h:mm a").format("HH:mm:ssZ")
})
