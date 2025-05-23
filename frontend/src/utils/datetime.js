import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

export const scrollToTarget = (calendarApi, targetDate) => {
  calendarApi.gotoDate(targetDate)
  calendarApi.scrollToTime({
    hours:
      targetDate.getHours() !== 0
        ? targetDate.getHours() - 1
        : targetDate.getHours(),
    minutes: targetDate.getHours() !== 0 ? targetDate.getMinutes() : 0
  })
}

export const isDifferentDay = (start, end) => {
  // Check if the day of start Date object is different from the day of end Date object
  return (
    start.getFullYear() !== end.getFullYear() ||
    start.getMonth() !== end.getMonth() ||
    start.getDate() !== end.getDate()
  )
}

export const getCurrentEndOfWeek = () => {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  if (dayOfWeek === 0) return today.toLocaleDateString("en-CA")

  const daysUntilSunday = 7 - dayOfWeek // Days to next Sunday
  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + daysUntilSunday)
  return endOfWeek.toLocaleDateString("en-CA")
}

export const getCurrentTime = () => {
  return new Date()
}

export const getStrTime = (datetime) => {
  const strTime = datetime.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  })
  return strTime
}

export const getStrDatetime = (datetime) => {
  const strDatetime = dayjs(datetime).format("dddd, MMMM Do, h:mm A")
  return strDatetime
}

export const parseTime = (datetime) => {
  const strTime = datetime.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  })
  const dayjsTime = dayjs(strTime, "HH:mm A")
  return dayjsTime
}

export const combineDateAndTime = (originDatetime, time) => {
  const date = dayjs(originDatetime).format("YYYY-MM-DD")
  const formattedTime = dayjs(time).format("HH:mm A")
  return dayjs(`${date} ${formattedTime}`, "YYYY-MM-DD HH:mm A")
}

export const getStrTimeBlock = (start, end) => {
  let strTimeBlock = dayjs(start).format("dddd, MMMM Do, h:mm A")
  strTimeBlock += ` - ${dayjs(end).format("h:mm A")}`
  return strTimeBlock
}

export const getStrDuration = (hours, minutes) => {
  let durationParts = []
  if (hours > 0) durationParts.push(`${hours} ${hours > 1 ? "hrs" : "hr"}`)
  if (minutes > 0)
    durationParts.push(`${minutes} ${minutes > 1 ? "mins" : "min"}`)
  return durationParts.join(" ")
}

export const convertFloatToHoursMinutes = (floatNumber, unit) => {
  let hours = 0
  let minutes = 0

  if (unit === "hr" || unit === "hrs")
    if (Number.isInteger(floatNumber)) hours = floatNumber
    else {
      hours = Math.floor(floatNumber)
      minutes = Math.floor((floatNumber - hours) * 60)
    }
  else if (Number.isInteger(floatNumber)) {
    hours = Math.floor(floatNumber / 60)
    minutes = floatNumber % 60
  } else {
    hours = Math.floor(Math.floor(floatNumber) / 60)
    minutes = Math.floor(floatNumber % 60)
  }
  return { hours, minutes }
}
