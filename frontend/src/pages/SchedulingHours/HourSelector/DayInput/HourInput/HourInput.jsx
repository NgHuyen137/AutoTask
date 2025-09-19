import dayjs from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
dayjs.extend(isSameOrAfter)

import { useState, useEffect } from "react"
import { useSchedulingHourContext } from "~/hooks/useContext"
import useDebounce from "~/hooks/useDebounce"
import { parseStringToTime } from "~/utils/datetime"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import OutlinedInput from "@mui/material/OutlinedInput"
import FormHelperText from "@mui/material/FormHelperText"
import IconButton from "@mui/material/IconButton"
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded"
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded"

export function TimeInput({
  schedulingHour,
  dayId,
  timeFrame,
  timeErrorState,
  timeErrorMessageState,
  timeId,
  onErrorChange
}) {
  const { timeError, setTimeError } = timeErrorState
  const { setTimeErrorMessage } = timeErrorMessageState
  const [time, setTime] = useState(timeId === "startTime" ? timeFrame.startTime : timeFrame.endTime)
  const debouncedTime = useDebounce(time, 100)

  const { 
    updateTime
  } = useSchedulingHourContext()

  const regex = /^((1[0-2]|0?[1-9]):([0-5][0-9]) ?([aApP][mM]))$/

  const formatTime = (time) => {
    const match = time.match(regex)
    if (match) {
      const hours = parseInt(match[1], 10)
      const minutes = match[3]
      const period = match[4].toLowerCase()
      return `${hours}:${minutes} ${period}`
    }
  }

  const handleTimeChange = (event) => {
    const newTime = event.target.value.trim()
    setTime(newTime)

    if (
      newTime.length === 0 || 
      !regex.test(newTime)
    ) {
      setTimeError(true)
      onErrorChange(true)
      setTimeErrorMessage("Invalid time")
    }
    else {
      setTimeError(false)
      onErrorChange(false)
      setTimeErrorMessage("")
    }
  }
  
  const handleTimeFormat = (event) => {
    const newTime = event.target.value
    if (!timeError && (newTime != time)) {
      const formattedNewTime = formatTime(newTime)
      setTime(formattedNewTime)
    }
  }

  useEffect(() => {
    if (!timeError) 
      updateTime(
        schedulingHour.id,
        dayId,
        timeFrame.id,
        timeId,
        debouncedTime
      ) 
  }, [debouncedTime])

  return (
    <OutlinedInput
      value={time}
      onChange={handleTimeChange}
      onBlur={handleTimeFormat}
      error={timeError}
      sx={{ 
        "& .MuiOutlinedInput-input": {
          maxWidth: "fit-content",
          padding: "8px",
          fontWeight: 400
        }
      }}
    />
  )
} 

export default function HourInput({ 
  timeFrame,
  schedulingHour,
  day,
  onErrorChange
}) {
  const [disableAddButton, setDisableAddButton] = useState(false)
  const [disableRemoveButton, setDisableRemoveButton] = useState(true)
  const [startTimeError, setStartTimeError] = useState(false)
  const [endTimeError, setEndTimeError] = useState(false)
  const [startTimeErrorMessage, setStartTimeErrorMessage] = useState("")
  const [endTimeErrorMessage, setEndTimeErrorMessage] = useState("")

  const {
    addTimeFrame,
    removeTimeFrame
  } = useSchedulingHourContext()

  const handleAddTimeFrame = () => {
    addTimeFrame(
      schedulingHour.id, 
      day.dayIndex, 
      timeFrame.id
    )
  }

  const handleRemoveTimeFrame = () => {
    removeTimeFrame(
      schedulingHour.id, 
      day.dayIndex, 
      timeFrame.id
    )
  }

  useEffect(() => {
    const timeFrameIndex = day.timeFrames.findIndex((tf) => tf.id === timeFrame.id)

    if (day.timeFrames.length === 1)
      setDisableRemoveButton(true)
    else
      setDisableRemoveButton(false)

    if (
      (
        timeFrameIndex !== day.timeFrames.length - 1 &&
        parseStringToTime(day.timeFrames[timeFrameIndex].endTime).add(1, "hour").isSameOrAfter(parseStringToTime(day.timeFrames[timeFrameIndex + 1].startTime))
      ) ||
      (
        timeFrameIndex === day.timeFrames.length - 1 &&
        parseStringToTime(day.timeFrames[timeFrameIndex].endTime).isAfter(dayjs().hour(22).minute(0).second(0))
      )
    )
      setDisableAddButton(true)
    else
      setDisableAddButton(false)

    if (
      parseStringToTime(day.timeFrames[timeFrameIndex].endTime).hour() === 0 ||
      (
        timeFrameIndex !== day.timeFrames.length - 1 &&
        parseStringToTime(day.timeFrames[timeFrameIndex].endTime) > parseStringToTime(day.timeFrames[timeFrameIndex + 1].startTime)
      )
    ) {
      setEndTimeError(true)
      onErrorChange(true)
      setEndTimeErrorMessage("Invalid time")
    }
    else {
      setEndTimeError(false)
      onErrorChange(false)
      setEndTimeErrorMessage("")
    }
  }, [day.timeFrames])

  useEffect(() => {
    if (
      !parseStringToTime(timeFrame.startTime).isBefore(parseStringToTime(timeFrame.endTime))
    ) {
      setStartTimeError(true)
      onErrorChange(true)
      setStartTimeErrorMessage(`Must be before ${timeFrame.endTime}`)
    } else if (parseStringToTime(timeFrame.startTime).isBefore(parseStringToTime(timeFrame.endTime))) {
      setStartTimeError(false)
      onErrorChange(false)
      setStartTimeErrorMessage("")
    }
  }, [timeFrame])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 2
      }}
    > 
      <Box>
        <TimeInput 
          schedulingHour={schedulingHour}
          dayId={day.dayIndex}
          timeFrame={timeFrame}
          timeErrorState={{
            timeError: startTimeError, 
            setTimeError: setStartTimeError
          }}
          timeErrorMessageState={{
            timeErrorMessage: startTimeErrorMessage, 
            setTimeErrorMessage: setStartTimeErrorMessage
          }}
          timeId="startTime"
          onErrorChange={onErrorChange}
        />
        {startTimeError && (
          <FormHelperText
            error={startTimeError}
            sx={{ 
              alignSelf: "flex-start", 
              marginLeft: "3px", 
              marginRight: 0
            }}
          >
            {startTimeErrorMessage}
          </FormHelperText>
        )}
      </Box>
      <Typography sx={{ fontSize: "0.9rem", margin: "8px 0" }}>to</Typography>
      <Box>
        <TimeInput 
          schedulingHour={schedulingHour}
          dayId={day.dayIndex}
          timeFrame={timeFrame}
          timeErrorState={{
            timeError: endTimeError, 
            setTimeError: setEndTimeError
          }}
          timeErrorMessageState={{
            timeErrorMessage: endTimeErrorMessage, 
            setTimeErrorMessage: setEndTimeErrorMessage
          }}
          timeId="endTime"
          onErrorChange={onErrorChange}
        />
        {endTimeError && (
          <FormHelperText
            error={endTimeError}
            sx={{ 
              alignSelf: "flex-start", 
              marginLeft: "3px", 
              marginRight: 0
            }}
          >
            {endTimeErrorMessage}
          </FormHelperText>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <IconButton
          sx={{
            color: "primary.dark",
            "&.Mui-disabled": {
              color: "#b6ccfe"
            }
          }}
          disabled={disableAddButton}
          onClick={handleAddTimeFrame}
        >
          <AddCircleOutlineRoundedIcon sx={{ fontSize: "1.25rem" }} />
        </IconButton>
        <IconButton
          sx={{
            visibility: disableRemoveButton ? "hidden" : "visible",
            color: "primary.dark"
          }}
          onClick={handleRemoveTimeFrame}
        >
          <RemoveCircleOutlineRoundedIcon sx={{ fontSize: "1.25rem" }} />
        </IconButton>
      </Box>
    </Box>
  )
}
