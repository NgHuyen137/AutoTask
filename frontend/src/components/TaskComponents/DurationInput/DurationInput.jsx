import { useState, useEffect } from "react"
import { useMediaQuery } from "@mui/material"
import { convertFloatToHoursMinutes, getStrDuration } from "~/utils/datetime"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded"
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded"

const useDefaultDuration = (
  label, 
  hours, 
  setHours, 
  minutes, 
  setMinutes, 
  task, 
  updateTask
) => {
  useEffect(() => {
    if (task.smartScheduling) {
      if (!task.duration && label === "Duration") {
        updateTask("duration", {
          hours,
          minutes
        })
        setHours(hours)
        setMinutes(minutes)
      }
      if (task.duration && label === "Duration") {
        updateTask("duration", {
          "hours": task.duration.hours,
          "minutes": task.duration.minutes
        })
        setHours(task.duration.hours)
        setMinutes(task.duration.minutes)
      }
      if (task.split && task.split.min_duration && label === "Min duration") {
        updateTask("split", task.split)
        setHours(task.split.min_duration.hours)
        setMinutes(task.split.min_duration.minutes)
      }
    }
  }, [
    task.smartScheduling, 
    task.duration?.hours,
    task.duration?.minutes,
    task.split?.min_duration?.hours,
    task.split?.min_duration?.minutes
  ])
}

const useChangeDuration = (
  label,
  hours,
  minutes,
  setStrDuration,
  updateField,
  updateTask
) => {
  useEffect(() => {
    // Whenever hours or minutes changes, strDuration will be updated to display on screen
    setStrDuration(getStrDuration(hours, minutes))

    // Update duration when clicking add or remove button
    if (label === "Duration")
      updateTask(updateField, {
        hours,
        minutes
      })
  }, [hours, minutes])
}

const useSplit = (
  split,
  label,
  setHours,
  setMinutes,
  setStrDuration,
  task,
  updateTask
) => {
  useEffect(() => {
    // Reset state of Min Duration
    if (!split && !task.split && label === "Min duration") {
      setHours(0)
      setMinutes(0)
      setStrDuration("")
      updateTask("split", null)
    }

    // Set default split
    if (split && !task.split && label === "Min duration") {
      setHours(0)
      setMinutes(30)
      setStrDuration("30 mins")
      updateTask("split", {
        "min_duration": {
          "hours": 0,
          "minutes": 30
        }
      })
    }
  }, [split])
}

export default function DurationInput({ props, taskState }) {
  const { label, updateField, split } = props
  const { task, updateTask } = taskState
  const [hours, setHours] = useState(0)  
  const [minutes, setMinutes] = useState(30)
  const [strDuration, setStrDuration] = useState("30 mins")

  const isLessThan400 = useMediaQuery("(max-width: 399px)")

  useDefaultDuration(label, hours, setHours, minutes, setMinutes, task, updateTask)
  useChangeDuration(
    label,
    hours,
    minutes,
    setStrDuration,
    updateField,
    updateTask
  )
  useSplit(split, label, setHours, setMinutes, setStrDuration, task, updateTask)

  const formatStrDuration = (event) => {
    const strDuration = event.target.value
    const validTimeUnits = ["hr", "hrs", "min", "mins"]

    // If the string is empty or contains invalid units, set default value
    if (
      !strDuration ||
      validTimeUnits.every((unit) => !strDuration.includes(unit))
    ) {
      if (label === "Duration") {
        setStrDuration("30 mins")
        updateTask(updateField, {
          hours: 0,
          minutes: 30
        })
      } else {
        setStrDuration("0 min")
        updateTask("split", {
          min_duration: {
            hours: 0,
            minutes: 0
          }
        })
      }
      return
    }

    // Find all valid units
    const regex = /\b\d*\s*\.?\s*\d+\s*(hr|hrs|min|mins)\b/g
    const matches = [...strDuration.matchAll(regex)].map((match) => match[0])

    if (!matches) {
      if (label === "Duration") {
        setStrDuration("30 mins")
        updateTask(updateField, {
          hours: 0,
          minutes: 30
        })
      } else {
        setStrDuration("0 min")
        updateTask("split", {
          min_duration: {
            hours: 0,
            minutes: 0
          }
        })
      }
      return
    }

    // Calculate total hours and total minutes if there are same units
    let totalHours = 0
    let totalMinutes = 0
    matches.forEach((match) => {
      const regex = /(\d*\s*\.?\s*\d+)\s*(hr|hrs|min|mins)/
      const matches = match.match(regex)
      const floatNumber = parseFloat(matches[1].replace(/\s+/, ""))

      const { hours, minutes } = convertFloatToHoursMinutes(
        floatNumber,
        matches[2]
      )
      totalHours += hours
      totalMinutes += minutes
    })

    if (totalHours === 0 && totalMinutes == 0) {
      if (label === "Duration") {
        setStrDuration("30 mins")
        updateTask(updateField, {
          hours: 0,
          minutes: 30
        })
      } else {
        setStrDuration("0 min")
        updateTask("split", {
          min_duration: {
            hours: 0,
            minutes: 0
          }
        })
      }
      return
    }

    let durationParts = []
    if (totalHours > 0)
      durationParts.push(`${totalHours} ${totalHours > 1 ? "hrs" : "hr"}`)
    if (totalMinutes > 0)
      durationParts.push(`${totalMinutes} ${totalMinutes > 1 ? "mins" : "min"}`)

    setHours(totalHours)
    setMinutes(totalMinutes)

    if (label === "Duration")
      updateTask(updateField, {
        hours: totalHours,
        minutes: totalMinutes
      })
    else
      updateTask("split", {
        min_duration: {
          hours: totalHours,
          minutes: totalMinutes
        }
      })
  }

  return (
    <Box>
      <TextField
        fullWidth={label === "Min duration" ? true : false}
        disabled={!split && label === "Min duration" ? true : false}
        value={strDuration}
        label={label}
        variant="outlined"
        {...(label === "Duration"
          ? {
              slotProps: {
                input: {
                  endAdornment: (
                    <InputAdornment>
                      <IconButton
                        onClick={() => {
                          if (hours === 0 && minutes === 15) return
                          else if (hours !== 0 && minutes === 15) {
                            setMinutes(0)
                          } else if (hours !== 0 && minutes === 0) {
                            setHours((prev) => prev - 1)
                            setMinutes(45)
                          } else if (minutes > 15)
                            setMinutes((prev) => prev - 15)
                        }}
                      >
                        <RemoveCircleOutlineRoundedIcon
                          sx={{ fontSize: "1.3rem", color: "primary.main" }}
                        />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          if (minutes === 45) {
                            setHours((prev) => prev + 1)
                            setMinutes(0)
                          } else setMinutes((prev) => prev + 15)
                        }}
                      >
                        <AddCircleOutlineRoundedIcon
                          sx={{ fontSize: "1.3rem", color: "primary.main" }}
                        />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }
            }
          : {})}
        onChange={(event) => setStrDuration(event.target.value)}
        onBlur={formatStrDuration}
        sx={{
          "& .MuiOutlinedInput-root": {
            height: "46px",
            maxWidth: !isLessThan400
              ? label === "Duration"
                ? "196px"
                : "132px"
              : "100%",
            "& legend": {
              display: "none"
            }
          },
          "& .MuiOutlinedInput-notchedOutline": {
            padding: "0 !important"
          },
          "& .MuiOutlinedInput-input": {
            padding: "16px 14px 4px 13px"
          },
          "& .MuiInputLabel-root": {
            transition: "all 0.2s ease-in-out"
          },
          "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
            {
              transform: "translate(12px, 0px) scale(.75)"
            },
          "& .MuiInputLabel-root:not(.Mui-focused):not(.MuiFormLabel-filled)": {
            top: "0%",
            transition: "0.3s ease-in-out"
          }
        }}
      ></TextField>
    </Box>
  )
}
