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
    if (field !== "split")
      setTask((prev) => ({ ...prev, [field]: value }))
  }

  return { task, updateTask }
}
