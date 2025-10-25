import dayjs from "dayjs"
import { useState } from "react"

import { DatePicker } from "@mantine/dates"
import classes from "./DateRangeCalendar.module.css"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

export default function DateRangeCalendar({ dateRange, onDateRangeChange }) {
  return (
    <DatePicker
      type="range"
      size="xs"
      radius="md"
      value={dateRange}
      onChange={onDateRangeChange}
      classNames={{
        day: classes.day,
        monthCell: classes.monthCell,
        weekday: classes.weekday,
        calendarHeaderLevel: classes.calendarHeaderLevel
      }}
    />
  )
}
