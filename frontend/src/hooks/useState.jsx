import dayjs from "dayjs"
import { useState } from "react"

// Custom hook for managing Task state
export const useTaskState = () => {
  const [task, setTask] = useState({
    smartScheduling: false,
    name: "",
    status: 0, // Default to Not Completed
    priority: 1, // Default to Normal
    tags: [],
    description: "",
    duration: null,
    split: null,
    schedulingHour: null,
    startAt: null,
    endAt: null,
    startDate: null,
    dueDate: null
  })

  const updateTask = (field, value) => {
    setTask((prev) => ({ ...prev, [field]: value }))
  }

  return { task, updateTask }
}


export const useSchedulingHourState = () => {
  const [schedulingHour, setSchedulingHour] = useState({
    name: "",
    description: "",
    daysOfWeek: Array.from({ length: 5 }, (_, index) => ({
      dayIndex: index,
      timeFrames: [
        {
          startTime: dayjs().hour(9).minute(0).format("h:mm a"),
          endTime: dayjs().hour(17).minute(0).format("h:mm a")
        }
      ]
    }))
  })

  const resetSchedulingHourState = () => {
    setSchedulingHour({
      name: "",
      description: "",
      daysOfWeek: Array.from({ length: 5 }, (_, index) => ({
        dayIndex: index,
        timeFrames: [
          {
            startTime: dayjs().hour(9).minute(0).format("h:mm a"),
            endTime: dayjs().hour(17).minute(0).format("h:mm a")
          }
        ]
      }))
    })
  } 

  const updateSchedulingHour = (field, value) => {
    setSchedulingHour((prev) => ({ ...prev, [field]: value }))
  }

  return { 
    schedulingHour,
    resetSchedulingHourState, 
    updateSchedulingHour 
  }
}
