import dayjs from "dayjs"
import {
  differenceInDays,
  startOfWeek as getStartOfWeek,
  endOfWeek as getEndOfWeek
} from "date-fns"
import { useEffect, useMemo, useState, useRef } from "react"
import { usePlannerContext } from "~/hooks/useContext"
import { useFetchAllTasks } from "~/hooks/useQuery"
import { useUpdateTask } from "~/hooks/useMutation"
import { useCalendarView } from "~/hooks/useEffect"
import Event from "./Event/Event"
import CalendarHeader from "./CalendarHeader/CalendarHeader"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import {
  getCurrentTime,
  isDifferentDay,
  scrollToTarget
} from "~/utils/datetime"
import "./Calendar.css"
import Box from "@mui/material/Box"

const useToday = (setToday) => {
  useEffect(() => {
    // Calculate the time until midnight
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const msUntilMidnight = midnight - now

    // Set timeout to update state at midnight
    const timeout = setTimeout(
      () => setToday(new Date().getDay()),
      msUntilMidnight
    )

    return () => clearTimeout(timeout)
  }, [])
}

const useCalendarHeaderPadding = () => {
  // Add padding equal to the scrollbar's width to Calendar Header
  useEffect(() => {
    const calendarContainer = document.querySelector(".fc")
    const calendarBodyContainer = document.querySelector(".fc-timegrid-body")
    const calendarHeader = document.querySelector(
      ".fc-scrollgrid-section-header > th > .fc-scroller-harness > .fc-scroller"
    )
    const scrollbarWidth =
      calendarContainer.clientWidth - calendarBodyContainer.clientWidth
    calendarHeader.style.paddingRight = `${scrollbarWidth}px`
  }, [])
}

const useScrollToCurrentTime = (calendarRef) => {
  // Scroll to current time
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()

      const scrollToCurrentTime = () => {
        const currentDateTime = new Date()
        scrollToTarget(calendarApi, currentDateTime)
      }

      requestAnimationFrame(scrollToCurrentTime)
    }
  }, [])
}

const useScrollToSelectedTask = (
  targetTask,
  openTaskSidebar,
  calendarRef,
  calendarView
) => {
  // Scroll to current selected Task
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()

      const scrollToSelectedTask = () => {
        if (targetTask && openTaskSidebar) {
          const targetDate = new Date(targetTask.startAt)
          scrollToTarget(calendarApi, targetDate)
        }
      }

      // Use requestAnimationFrame to ensure this runs after React has finished rendering
      requestAnimationFrame(scrollToSelectedTask)
    }
  }, [targetTask, calendarView])
}

const useChangeSelectTaskCursor = (popperRef) => {
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (
        e.target.closest(".fc-timegrid-slot.fc-timegrid-slot-label") ||
        popperRef.current
      )
        return
      document.body.style.cursor = "s-resize"
    }

    const handleMouseUp = () => {
      document.body.style.cursor = "default"
    }

    const calendarBody = document.querySelector(".fc-timegrid-slots tbody")
    calendarBody.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      calendarBody.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])
}

export default function Calendar({ calendarRef, anchorEl, popperRef }) {
  const {
    showTaskCreatePopup,
    setShowTaskCreatePopup,
    setEnterTaskCreatePopup,
    showTaskCreateForm,
    setStartDateTime,
    setEndDateTime,
    setStartOfWeek,
    setEndOfWeek,
    openTaskSidebar,
    setOpenTaskSidebar,
    targetTask,
    setTargetTask,
    calendarView,
    setCalendarView
  } = usePlannerContext()

  // Change Calendar view
  const calendarContainerRef = useRef(null)
  const calendarScreenWidthThreshold = 500
  useCalendarView(
    calendarRef,
    calendarContainerRef,
    setCalendarView,
    calendarScreenWidthThreshold
  )

  // Changle cursor when selecting Time block on Calendar
  useChangeSelectTaskCursor(popperRef)

  // Scroll to current time when mounts
  useScrollToCurrentTime(calendarRef)

  // Scroll to selected Task
  useScrollToSelectedTask(targetTask, openTaskSidebar, calendarRef)

  // Add padding to Calendar Header
  useCalendarHeaderPadding()

  // Change Calendar header's style when today changes
  const [today, setToday] = useState(new Date().getDay())
  useToday(setToday)

  // Track when users click previous and next button in Calendar view
  const [startDateView, setStartDateView] = useState(null)

  const tasks = useFetchAllTasks()
  const { updateSingleTask } = useUpdateTask()

  const eventObjs = useMemo(() => {
    // A function used to create a list of FullCalendar Event objects for displaying on the calendar
    if (tasks) {
      return tasks.flatMap((task) => {
        if (task.status === 0)
          return task["time_allocations"].map((time_allocation) => ({
            id: task["_id"],
            start: time_allocation["start_at"],
            end: time_allocation["end_at"],
            extendedProps: {
              name: task["name"],
              priority: task["priority"],
              status: task["status"],
              tags: task["tags"],
              description: task["description"],
              smartScheduling: task["smart_scheduling"],
              schedulingHour: task["scheduling_hour_id"],
              duration: task["duration"],
              split: task["split"],
              startDate: task["start_date"],
              dueDate: task["due_date"],
              createdAt: task["created_at"]
            }
          }))
        return []
      })
    }
    return []
  }, [tasks])

  const handleSelectTimeBlock = (info) => {
    setShowTaskCreatePopup(true)
    setEnterTaskCreatePopup(true)

    // Get selected start & end time
    setStartDateTime(dayjs(info.start))
    setEndDateTime(dayjs(info.end))
  }

  const handleTaskClick = (args) => {
    const { id, start, end, extendedProps } = args.event
    const {
      name,
      status,
      priority,
      tags,
      description,
      smartScheduling,
      schedulingHour,
      duration,
      split,
      startDate,
      dueDate,
      createdAt
    } = extendedProps

    const clickedTask = {
      id,
      name,
      status,
      priority,
      tags,
      description,
      smartScheduling,
      schedulingHour,
      duration,
      split,
      startAt: dayjs(start),
      endAt: dayjs(end),
      startDate: dayjs(startDate),
      dueDate: dayjs(dueDate),
      createdAt
    }

    setOpenTaskSidebar(true)
    localStorage.setItem("openTaskSidebar", true)
    setTargetTask(clickedTask) // Store details of clicked task
    localStorage.setItem("targetTask", JSON.stringify(clickedTask))
  }

  const handleResizeAndDragTimeBlock = (info) => {
    // A function used to handle task resize event
    const oldEndDateTime = dayjs(info.oldEvent.end)
    const newStartDateTime = info.endDelta
      ? dayjs(info.oldEvent.start)
      : dayjs(info.event.start)
    const newEndDateTime = info.endDelta
      ? oldEndDateTime.add(info.endDelta.milliseconds, "millisecond")
      : dayjs(info.event.end)

    if (info.endDelta && newEndDateTime.isSame(oldEndDateTime)) return

    // Update task
    const updatedTaskData = {
      scheduling_hour_id: info.oldEvent.extendedProps["schedulingHour"],
      name: info.oldEvent.extendedProps["name"],
      priority: info.oldEvent.extendedProps["priority"],
      status: info.oldEvent.extendedProps["status"],
      tags: info.oldEvent.extendedProps["tags"],
      duration: info.oldEvent.extendedProps["duration"],
      split: info.oldEvent.extendedProps["split"],
      smart_scheduling: info.oldEvent.extendedProps["smartScheduling"],
      start_date: info.oldEvent.extendedProps["startDate"],
      due_date: info.oldEvent.extendedProps["dueDate"],
      created_at: dayjs(info.oldEvent.extendedProps["created_at"]),
      description: info.oldEvent.extendedProps["description"],
      time_allocations: [
        {
          start_at: newStartDateTime,
          end_at: newEndDateTime,
          is_scheduled_ontime: true
        }
      ]
    }

    updateSingleTask({ id: info.oldEvent.id, updatedTaskData })

    setTargetTask({
      ...targetTask,
      startAt: newStartDateTime,
      endAt: newEndDateTime
    })
    localStorage.setItem("targetTask", JSON.stringify(targetTask))
  }

  useEffect(() => {
    // Style arrow of now indicator
    const nowIndicatorLine = document.querySelector(
      ".fc-timegrid-now-indicator-line"
    )

    if (!nowIndicatorLine) return
    const nowIndicatorLineContainer = nowIndicatorLine.parentElement
    const customArrow = document.createElement("div")

    const topValue = parseFloat(window.getComputedStyle(nowIndicatorLine).top)

    customArrow.style.position = "absolute"
    customArrow.style.width = "8px"
    customArrow.style.height = "8px"
    customArrow.style.top = `${topValue - 4}px`
    customArrow.style.borderRadius = "50%"
    customArrow.style.backgroundColor = "#D90403"
    customArrow.style.zIndex = "1500"

    nowIndicatorLineContainer.appendChild(customArrow)

    // Observe changes to the now indicator line
    const observer = new MutationObserver(() => {
      const updatedTopValue = parseFloat(
        window.getComputedStyle(nowIndicatorLine).top
      )
      customArrow.style.top = `${updatedTopValue - 4}px`
    })
    observer.observe(nowIndicatorLine, { attributes: true })
    return () => {
      customArrow.remove() // Remove the arrow when effect re-runs
      observer.disconnect() // Cleanup observer
    }
  }, [today, startDateView, calendarView])

  useEffect(() => {
    // Style today header
    const todayContainer = document.createElement("div")
    if (document.querySelector(".fc-day-today")) {
      if (
        document.querySelector(".fc-day-today").children[0].children.length > 1
      )
        return

      const todayHeader = document
        .querySelector(".fc-day-today")
        .children[0].querySelector(".fc-col-header-cell-cushion")

      const [todayNum, todayName] = todayHeader.textContent.split(" ")

      // Create a container for the custom element
      todayContainer.style.display = "flex"
      todayContainer.style.alignItems = "center"
      todayContainer.style.justifyContent = "center"
      todayContainer.style.gap = "4px"

      // Create a circular div for the day number
      const todayNumCircle = document.createElement("div")
      todayNumCircle.style.minWidth = "23px"
      todayNumCircle.style.height = "23px"
      todayNumCircle.style.display = "flex"
      todayNumCircle.style.alignItems = "center"
      todayNumCircle.style.justifyContent = "center"
      todayNumCircle.style.borderRadius = "50%"
      todayNumCircle.style.backgroundColor = "#598aff"
      todayNumCircle.style.color = "white"

      const todayNumSpan = document.createElement("span")
      todayNumSpan.textContent = todayNum
      todayNumSpan.style.fontWeight = "600"
      todayNumSpan.style.fontSize = "0.8rem"
      todayNumCircle.appendChild(todayNumSpan)

      // Create a span for the day name
      const todayNameSpan = document.createElement("span")
      todayNameSpan.textContent = todayName
      todayNameSpan.style.fontWeight = "600"
      todayNameSpan.style.fontSize = "0.8rem"

      // Append todayNumCircle and todayNameSpan to the custom container
      todayContainer.appendChild(todayNameSpan)
      todayContainer.appendChild(todayNumCircle)

      // Replace the grandchild with the custom container
      todayHeader.replaceWith(todayContainer)
    }

    return () => todayContainer.remove()
  }, [today, startDateView])

  useEffect(() => {
    // Style past day headers
    const dayPastElements = document.querySelectorAll(
      ".fc-col-header-cell.fc-day-past"
    )
    if (dayPastElements) {
      dayPastElements.forEach((dayPastElement) => {
        if (dayPastElement.children[0].children.length > 1) return

        const dayPastHeader = dayPastElement.children[0].children[0]
        const [dayPastNum, dayPastName] = dayPastHeader.textContent.split(" ")
        const dayPastContainer = document.createElement("div")
        const dayPastNumSpan = document.createElement("span")
        const dayPastNameSpan = document.createElement("span")

        dayPastContainer.style.display = "flex"
        dayPastContainer.style.justifyContent = "center"
        dayPastContainer.style.alignItems = "center"
        dayPastContainer.style.gap = "4px"

        dayPastNumSpan.textContent = dayPastNum
        dayPastNumSpan.style.fontWeight = 400
        dayPastNumSpan.style.fontSize = "0.8rem"
        dayPastNumSpan.style.color = "#5C5C5D"

        dayPastNameSpan.textContent = dayPastName
        dayPastNameSpan.style.fontWeight = 400
        dayPastNameSpan.style.fontSize = "0.8rem"
        dayPastNameSpan.style.color = "#5C5C5D"

        dayPastContainer.appendChild(dayPastNameSpan)
        dayPastContainer.appendChild(dayPastNumSpan)
        dayPastHeader.replaceWith(dayPastContainer)
      })
    }

    // Style future day headers
    const dayFutureElements = document.querySelectorAll(
      ".fc-col-header-cell.fc-day-future"
    )
    if (dayFutureElements) {
      dayFutureElements.forEach((dayFutureElement) => {
        if (dayFutureElement.children[0].children.length > 1) return

        const dayFutureHeader = dayFutureElement.children[0].children[0]
        const [dayFutureNum, dayFutureName] =
          dayFutureHeader.textContent.split(" ")
        const dayFutureContainer = document.createElement("div")
        const dayFutureNumSpan = document.createElement("span")
        const dayFutureNameSpan = document.createElement("span")

        dayFutureContainer.style.display = "flex"
        dayFutureContainer.style.justifyContent = "center"
        dayFutureContainer.style.alignItems = "center"
        dayFutureContainer.style.gap = "4px"

        dayFutureNumSpan.textContent = dayFutureNum
        dayFutureNumSpan.style.fontWeight = 400
        dayFutureNumSpan.style.fontSize = "0.8rem"

        dayFutureNameSpan.textContent = dayFutureName
        dayFutureNameSpan.style.fontWeight = 400
        dayFutureNameSpan.style.fontSize = "0.8rem"

        dayFutureContainer.appendChild(dayFutureNameSpan)
        dayFutureContainer.appendChild(dayFutureNumSpan)
        dayFutureHeader.replaceWith(dayFutureContainer)
      })
    }
  }, [today, startDateView, calendarView])

  return (
    <Box
      ref={calendarContainerRef}
      sx={{
        height: "100%",
        minWidth: "176px"
      }}
    >
      <CalendarHeader calendarRef={calendarRef} />
      <FullCalendar
        ref={calendarRef}
        plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        selectable={showTaskCreatePopup || showTaskCreateForm ? false : true}
        selectMirror={true}
        select={handleSelectTimeBlock}
        selectAllow={(selectInfo) => {
          return (
            !isDifferentDay(selectInfo.start, selectInfo.end) ||
            (selectInfo.end.getDay() - selectInfo.start.getDay() === 1 &&
              selectInfo.end.getHours() === 0 &&
              selectInfo.end.getMinutes() === 0)
          )
        }}
        editable={true}
        eventResize={handleResizeAndDragTimeBlock}
        eventDrop={handleResizeAndDragTimeBlock}
        unselectAuto={false}
        nowIndicator={true}
        now={getCurrentTime()}
        nowIndicatorClassNames="now-indicator"
        scrollTimeReset={false}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          meridiem: "short"
        }}
        eventContent={(args) => {
          return <Event props={{ args, anchorEl }} />
        }}
        eventClick={handleTaskClick}
        events={eventObjs}
        datesSet={(args) => {
          const newStartDateView = args.start.toISOString().split("T")[0]
          setStartDateView((prev) =>
            prev !== newStartDateView ? newStartDateView : prev
          )

          if (differenceInDays(args.end, args.start) === 1) {
            const startOfWeek = getStartOfWeek(args.start, { weekStartsOn: 1 })
              .toISOString()
              .split("T")[0]
            const endOfWeek = getEndOfWeek(args.start, { weekStartsOn: 1 })
              .toISOString()
              .split("T")[0]
            setStartOfWeek((prev) =>
              prev !== startOfWeek ? startOfWeek : prev
            )
            setEndOfWeek((prev) => (prev !== endOfWeek ? endOfWeek : prev))
          } else {
            const startOfWeek = args.start.toISOString().split("T")[0]
            const endOfWeek = args.end.toISOString().split("T")[0]
            setStartOfWeek((prev) =>
              prev !== startOfWeek ? startOfWeek : prev
            )
            setEndOfWeek((prev) => (prev !== endOfWeek ? endOfWeek : prev))
          }
        }}
        titleFormat={{
          year: "numeric",
          month: "long"
        }}
        headerToolbar={{
          left: "title",
          center: "",
          right: "prev,next"
        }}
        themeSystem="bootstrap5"
        buttonIcons={{
          prev: "arrow-left-short",
          next: "arrow-right-short"
        }}
        slotDuration="00:15:00"
        slotLabelInterval="01:00:00"
        firstDay={1}
        allDaySlot={false}
        dayHeaderFormat={{
          day: "numeric",
          weekday: "short"
        }}
      />
    </Box>
  )
}
