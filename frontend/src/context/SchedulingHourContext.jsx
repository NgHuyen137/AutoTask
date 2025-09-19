import dayjs from "dayjs"
import { nanoid } from "nanoid"
import { parseStringToTime } from "~/utils/datetime"
import { createContext, useReducer, useState } from "react"

export const SchedulingHourContext = createContext({})

const updateName = (
  state,
  payload
) => state.map((schedulingHour) => {
  if (schedulingHour.id === payload.schedulingHourId) {
    return {
      ...schedulingHour,
      name: payload.name
    }
  }
  return schedulingHour
})

const updateDescription = (
  state,
  payload
) => state.map((schedulingHour) => {
  if (schedulingHour.id === payload.schedulingHourId) {
    return {
      ...schedulingHour,
      description: payload.description
    }
  }
  return schedulingHour
})

const addDay = (
  state,
  payload
) => state.map((schedulingHour) => {
  if (schedulingHour.id === payload.schedulingHourId) {
    const newDay = {
      dayIndex: payload.dayId,
      timeFrames: [
        {
          startTime: dayjs().hour(9).minute(0).format("h:mm a"),
          endTime: dayjs().hour(17).minute(0).format("h:mm a")
        }
      ]
    }

    return {
      ...schedulingHour,
      daysOfWeek: [...schedulingHour.daysOfWeek, newDay]
    }
  }
  return schedulingHour
})

const removeDay = (
  state,
  payload
) => state.map((schedulingHour) => {
  if (schedulingHour.id === payload.schedulingHourId) {
    return {
      ...schedulingHour,
      daysOfWeek: schedulingHour.daysOfWeek.filter((day) => day.dayIndex !== payload.dayId)
    }
  }
  return schedulingHour
})

const addTimeFrame = (
  state,
  payload
) => state.map((schedulingHour) => {
  if (schedulingHour.id === payload.schedulingHourId) {
    return {
      ...schedulingHour,
      daysOfWeek: schedulingHour.daysOfWeek.map((day) => {
        if (day.dayIndex === payload.dayId) {
          const timeFrameIndex = day.timeFrames.findIndex((timeFrame) => timeFrame.id === payload.timeFrameId)

          let newTimeFrame = {}
          if (day.timeFrames[timeFrameIndex].endTime === "10:00 pm")
            newTimeFrame = {
              id: nanoid(),
              startTime: "11:00 pm",
              endTime: "11:59 pm"
            }
          else
            newTimeFrame = {
              id: nanoid(),
              startTime: parseStringToTime(day.timeFrames[timeFrameIndex].endTime).add(1, "hour").format("h:mm a"),
              endTime: parseStringToTime(day.timeFrames[timeFrameIndex].endTime).add(2, "hour").format("h:mm a")
            }

          return { 
            ...day, 
            timeFrames: [
              ...day.timeFrames.slice(0, timeFrameIndex + 1),
              newTimeFrame,
              ...day.timeFrames.slice(timeFrameIndex + 1)
            ]
          }
        }
        return day
      })
    }
  }
  return schedulingHour
})

const removeTimeFrame = (
  state,
  payload
) => state.map((schedulingHour) => {
  if (schedulingHour.id === payload.schedulingHourId) {
    return {
      ...schedulingHour,
      daysOfWeek: schedulingHour.daysOfWeek.map((day) => {
        if (day.dayIndex === payload.dayId) {
          return {
            ...day,
            timeFrames: day.timeFrames.filter((timeFrame) => timeFrame.id !== payload.timeFrameId)
          }
        }
        return day
      })
    }
  }
  return schedulingHour
})

const updateTime = (
  state,
  payload
) => state.map((schedulingHour) => {
  if (schedulingHour.id === payload.schedulingHourId) {
    return {
      ...schedulingHour,
      daysOfWeek: schedulingHour.daysOfWeek.map((day) => {
        if (day.dayIndex === payload.dayId) {
          return {
            ...day,
            timeFrames: day.timeFrames.map((timeFrame) => {
              if (timeFrame.id === payload.timeFrameId) {
                return {
                  ...timeFrame,
                  [payload.timeId]: payload.updateValue
                }
              }
              return timeFrame
            })
          }
        }
        return day
      })
    }
  }
  return schedulingHour
})

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_NAME":
      return updateName(state, action.payload)
    case "UPDATE_DESCRIPTION":
      return updateDescription(state, action.payload)
    case "ADD_DAY":
      return addDay(state, action.payload)
    case "REMOVE_DAY":
      return removeDay(state, action.payload)
    case "SET_SCHEDULING_HOURS":
      return action.payload
    case "ADD_TIME_FRAME":
      return addTimeFrame(state, action.payload)
    case "REMOVE_TIME_FRAME":
      return removeTimeFrame(state, action.payload)
    case "UPDATE_TIME":
      return updateTime(state, action.payload)
    default:
      return state
  }
}

export const SchedulingHourProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, [])
  const [doneFetchingSchedulingHours, setDoneFetchingSchedulingHours] = useState(false)
  const [openUpdateSuccessBar, setOpenUpdateSuccessBar] = useState(false)
  const [enterUpdateSuccessBar, setEnterUpdateSuccessBar] = useState(false)

  // Define actions to update the state
  const setSchedulingHoursAction = (schedulingHoursData) => {
    dispatch({ type: "SET_SCHEDULING_HOURS", payload: schedulingHoursData })
  }

  const updateNameAction = (schedulingHourId, name) => {
    dispatch({ type: "UPDATE_NAME", payload: { schedulingHourId, name } })
  }

  const updateDescriptionAction = (schedulingHourId, description) => {
    dispatch({ type: "UPDATE_DESCRIPTION", payload: { schedulingHourId, description } })
  }

  const addDayAction = (schedulingHourId, dayId) => {
    dispatch({ type: "ADD_DAY", payload: { schedulingHourId, dayId } })
  }

  const removeDayAction = (schedulingHourId, dayId) => {
    dispatch({ type: "REMOVE_DAY", payload: { schedulingHourId, dayId } })
  }

  const addTimeFrameAction = (schedulingHourId, dayId, timeFrameId) => {
    dispatch({ type: "ADD_TIME_FRAME", payload: { schedulingHourId, dayId, timeFrameId } })
  }

  const removeTimeFrameAction = (schedulingHourId, dayId, timeFrameId) => {
    dispatch({ type: "REMOVE_TIME_FRAME", payload: { schedulingHourId, dayId, timeFrameId } })
  }

  const updateTimeAction = (schedulingHourId, dayId, timeFrameId, timeId, updateValue) => {
    dispatch({ type: "UPDATE_TIME", payload: { schedulingHourId, dayId, timeFrameId, timeId, updateValue } })
  }

  return (
    <SchedulingHourContext.Provider 
      value={{ 
        schedulingHours: state,  
        setSchedulingHours: setSchedulingHoursAction,
        updateName: updateNameAction,
        updateDescription: updateDescriptionAction,
        addDay: addDayAction,
        removeDay: removeDayAction,
        addTimeFrame: addTimeFrameAction,
        removeTimeFrame: removeTimeFrameAction,
        updateTime: updateTimeAction,
        doneFetchingSchedulingHours, setDoneFetchingSchedulingHours,
        openUpdateSuccessBar, setOpenUpdateSuccessBar,
        enterUpdateSuccessBar, setEnterUpdateSuccessBar
      }}
    >
      {children}
    </SchedulingHourContext.Provider>
  )
}
