import dayjs from "dayjs"
import { useState, createContext } from "react"

export const PlannerContext = createContext({})

export const PlannerProvider = ({ children }) => {
  const [calendarView, setCalendarView] = useState("timeGridWeek")

  const [showTaskCreatePopup, setShowTaskCreatePopup] = useState(false)
  const [enterTaskCreatePopup, setEnterTaskCreatePopup] = useState(false)

  // For storing Start & End datetime selected on Calendar
  const [startDateTime, setStartDateTime] = useState(null)
  const [endDateTime, setEndDateTime] = useState(null)

  const [startOfWeek, setStartOfWeek] = useState("")
  const [endOfWeek, setEndOfWeek] = useState("")

  // For showing Task Create Form when clicking on the New Task button
  const [enterTaskCreateForm, setEnterTaskCreateForm] = useState(false)
  const [showTaskCreateForm, setShowTaskCreateForm] = useState(false)

  // For managing Task Sidebar
  const [openTaskSidebar, setOpenTaskSidebar] = useState(() => {
    return JSON.parse(localStorage.getItem("openTaskSidebar")) ?? false
  })
  const [taskSidebarWidth, setTaskSidebarWidth] = useState(() => {
    return JSON.parse(localStorage.getItem("taskSidebarWidth")) ?? 479
  })
  const [openUpdate, setOpenUpdate] = useState(() => {
    return JSON.parse(localStorage.getItem("openUpdate")) ?? false
  })

  // Details of Selected Task
  const [targetTask, setTargetTask] = useState(() => {
    const selectedTask = localStorage.getItem("targetTask")
    if (selectedTask === "null" || !selectedTask) return null

    const parsedTask = JSON.parse(selectedTask)
    return {
      ...parsedTask,
      createdAt: parsedTask.createdAt ? dayjs(parsedTask.createdAt) : null,
      startDate: parsedTask.startDate ? dayjs(parsedTask.startDate) : null,
      dueDate: parsedTask.dueDate ? dayjs(parsedTask.dueDate) : null,
      startAt: parsedTask.startAt ? dayjs(parsedTask.startAt) : null,
      endAt: parsedTask.endAt ? dayjs(parsedTask.endAt) : null
    }
  })

  return (
    <PlannerContext.Provider
      value={{
        calendarView,
        setCalendarView,

        showTaskCreatePopup,
        setShowTaskCreatePopup,
        enterTaskCreatePopup,
        setEnterTaskCreatePopup,
        startDateTime,
        setStartDateTime,
        endDateTime,
        setEndDateTime,
        startOfWeek,
        setStartOfWeek,
        endOfWeek,
        setEndOfWeek,

        showTaskCreateForm,
        setShowTaskCreateForm,
        enterTaskCreateForm,
        setEnterTaskCreateForm,

        openTaskSidebar,
        setOpenTaskSidebar,
        taskSidebarWidth,
        setTaskSidebarWidth,
        openUpdate,
        setOpenUpdate,

        targetTask,
        setTargetTask
      }}
    >
      {children}
    </PlannerContext.Provider>
  )
}
