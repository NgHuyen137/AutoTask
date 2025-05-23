import { useState, useRef, useEffect } from "react"
import { useScreenSize } from "~/hooks/useEffect"
import { usePlannerContext } from "~/hooks/useContext"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"

export default function CustomTimePicker({
  label,
  calendarRef,
  timeErrorState
}) {
  const { startDateTime, setStartDateTime, endDateTime, setEndDateTime } =
    usePlannerContext()
  const { timeError, setTimeError } = timeErrorState
  const [errorMsg, setErrorMsg] = useState("")
  const inputRef = useRef(null)

  const screenWidth = useScreenSize()
  const sidebarScreenSizeThreshold = 800

  // Store the initial time
  const initialTime = useRef({ startDateTime, endDateTime })

  const getTimeState = () => {
    if (label === "Start time") return startDateTime
    return endDateTime
  }

  const handleTimeChange = (newTime) => {
    if (label === "Start time") setStartDateTime(newTime)
    else setEndDateTime(newTime)
  }

  const handleDisableTime = (value) => {
    if (label === "Start time") return value.isAfter(endDateTime)
  }

  const errorMessage = () => {
    if (errorMsg === "invalidDate") return "Invalid time"
    if (
      ["shouldDisableTime-hours", "shouldDisableTime-minutes"].includes(
        errorMsg
      )
    )
      return "Must be less than end"
    return errorMsg
  }

  useEffect(() => {
    if (!startDateTime) setStartDateTime(initialTime.current.startDateTime)
    if (!endDateTime) setEndDateTime(initialTime.current.endDateTime)
  }, [startDateTime, endDateTime])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        sx={{
          "& .MuiIconButton-root": {
            padding: "6px",
            marginRight: "-4px"
          },
          "& .MuiSvgIcon-root": {
            fontSize: "1.2rem",
            color: "primary.main"
          },
          "& .MuiFormHelperText-root": {
            marginLeft: 0,
            marginRight: 0
          },
          "& .MuiInputBase-root.Mui-focused": { backgroundColor: "#f2f6ff" },
          "& .MuiFilledInput-root": {
            backgroundColor: "#FFFFFF",
            "&:hover::before": {
              borderBottom: "1px solid #80a5ff !important"
            }
          }
        }}
        desktopModeMediaQuery="(min-width: 372px)"
        shouldDisableTime={handleDisableTime}
        closeOnSelect={false}
        inputRef={inputRef}
        label={label}
        defaultValue={label === "Start time" ? startDateTime : endDateTime}
        value={getTimeState()}
        onChange={handleTimeChange}
        onError={(errorName) => {
          if (errorName) {
            setTimeError(true)
            setErrorMsg(errorName)
            return
          }
          setTimeError(false)
        }}
        slotProps={{
          dialog: {
            sx: {
              "& .MuiDialogActions-root .MuiButton-root": {
                color: "#598aff !important",
                fontWeight: 600
              }
            }
          },
          layout: {
            sx: {
              "& .MuiClockPointer-thumb": {
                backgroundColor: "primary.dark",
                border: "16px solid #598aff"
              },
              "& .MuiTimeClock-root": {
                width: "100%",
                maxHeight: "260px"
              }
            }
          },
          textField: {
            variant: "filled",
            error: timeError,
            helperText: timeError ? errorMessage() : ""
          },
          popper: {
            disablePortal: true,
            anchorEl: () => inputRef.current,
            placement: "bottom",
            modifiers: [
              {
                name: "flip",
                options: {
                  fallbackPlacements: ["right-start", "left-start"],
                  boundary: calendarRef?.current
                }
              },
              {
                name: "preventOverflow",
                options: {
                  padding: 16,
                  boundary: calendarRef?.current
                }
              }
            ]
          },
          mobilePaper: {
            sx: {
              "@media (max-width: 332px)": {
                minWidth: "calc(100vw - 32px) !important"
              },
              minWidth: "300px !important",
              borderRadius: "12px"
            }
          },
          nextIconButton: {
            sx: {
              display:
                screenWidth <= sidebarScreenSizeThreshold ? "none" : "auto"
            }
          },
          previousIconButton: {
            sx: {
              display:
                screenWidth <= sidebarScreenSizeThreshold ? "none" : "auto"
            }
          }
        }}
      />
    </LocalizationProvider>
  )
}
