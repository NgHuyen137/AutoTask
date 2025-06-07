import dayjs from "dayjs"
import { useScreenSize } from "~/hooks/useEffect"
import { useRef, useState, useEffect } from "react"
import { useMediaQuery } from "@mui/material"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DateTimePicker as MuiDateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers"
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded"
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded"

const useDefaultDatetime = (task, updateTask) => {
  useEffect(() => {
    // Set default
    if (task.smartScheduling && !task.startDate?.date() && !task.dueDate?.date()) {
      updateTask("startDate", dayjs())
      updateTask("dueDate", dayjs().add(30, "minutes"))
    }

    if (!task.smartScheduling && !task.startAt && !task.endAt) {
      updateTask("startAt", dayjs())
      updateTask("endAt", dayjs().add(30, "minutes"))
    }
  }, [task.smartScheduling])
}

const useDifferentDay = (task, setIsDifferentDay) => {
  useEffect(() => {
    const isDifferentDay = !(
      task.startAt?.year() === task.endAt?.year() &&
      task.startAt?.month() === task.endAt?.month() &&
      task.startAt?.date() === task.endAt?.date()
    )

    setIsDifferentDay(isDifferentDay)
  }, [task.startAt, task.endAt])
}

export default function DateTimePicker({
  label,
  taskState,
  datetimeErrorState,
  props
}) {
  const isDesktop = useMediaQuery("(min-width: 500px)")

  const { task, updateTask } = taskState
  const { datetimeError, setDatetimeError } = datetimeErrorState
  const [errorMsg, setErrorMsg] = useState("")
  const [isDifferentDay, setIsDifferentDay] = useState(false)
  const datetimeInputRef = useRef(null)

  const screenWidth = useScreenSize()
  const sidebarScreenSizeThreshold = 800
  const enableTimePicker = screenWidth <= sidebarScreenSizeThreshold

  const handleDisableDate = (day) => {
    if (label === "Start date")
      return day.startOf("day") > task.dueDate?.startOf("day") ? true : false
    if (label === "Start datetime")
      return day.startOf("day") > task.endAt?.startOf("day") ? true : false

    if (label === "Due date")
      return day.startOf("day") < task.startDate?.startOf("day") ? true : false
    if (label === "End datetime")
      return day.startOf("day") < task.startAt?.startOf("day") ? true : false
  }

  const handleDisableTime = (time, view) => {
    if (label === "Start date") return time.isAfter(task.dueDate)

    if (label === "Start datetime") {
      return (
        time.isAfter(task.endAt) ||
        !(
          time.year() === task.endAt?.year() &&
          time.month() === task.endAt?.month() &&
          time.date() === task.endAt?.date()
        )
      )
    }
  }

  const errorMessage = () => {
    if (errorMsg === "invalidDate") return "Invalid date"

    if (
      (["shouldDisableTime-hours", "shouldDisableTime-minutes"].includes(
        errorMsg
      ) ||
        errorMsg === "shouldDisableDate") &&
      !isDifferentDay
    )
      return label === "Start date"
        ? "Must be less than due"
        : label === "Start datetime"
        ? "Must be less than end"
        : null

    if (isDifferentDay && label === "Start datetime")
      return "Must be the same date as end"
  }

  useDefaultDatetime(task, updateTask)
  useDifferentDay(task, setIsDifferentDay)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDateTimePicker
        disablePortal
        label={label}
        closeOnSelect={false}
        ref={datetimeInputRef}
        desktopModeMediaQuery="(min-width: 500px)"
        value={
          label === "Start date"
            ? task.startDate
            : label === "Due date"
            ? task.dueDate
            : label === "Start datetime"
            ? task.startAt
            : task.endAt
        }
        defaultValue={
          ["Start date", "Start datetime"].includes(label)
            ? dayjs()
            : dayjs().add(30, "minutes")
        }
        format="MMMM DD, YYYY hh:mma"
        views={
          isDesktop
            ? ["year", "month", "day"]
            : ["year", "month", "day", "hours", "minute"]
        }
        viewRenderers={{
          hours: enableTimePicker ? renderTimeViewClock : null,
          minutes: enableTimePicker ? renderTimeViewClock : null,
          seconds: enableTimePicker ? renderTimeViewClock : null
        }}
        shouldDisableDate={handleDisableDate}
        shouldDisableTime={handleDisableTime}
        onChange={(value) => {
          updateTask(
            label === "Start date"
              ? "startDate"
              : label === "Due date"
              ? "dueDate"
              : label === "Start datetime"
              ? "startAt"
              : "endAt",
            value
          )
        }}
        onError={(errorName) => {
          if (errorName) {
            if (
              errorName === "invalidDate" ||
              ["Start date", "Start datetime"].includes(label)
            ) {
              setDatetimeError(true)
              if (!isDifferentDay) setErrorMsg(errorName)
              return
            }
          }
          setErrorMsg("")
          setDatetimeError(false)
        }}
        slots={{
          leftArrowIcon: (params) => (
            <KeyboardArrowLeftRoundedIcon {...params} />
          ),
          rightArrowIcon: (params) => (
            <KeyboardArrowRightRoundedIcon {...params} />
          )
        }}
        slotProps={{
          textField: {
            helperText: datetimeError ? errorMessage() : "",
            sx: {
              "& .MuiFormHelperText-root": {
                marginLeft: 0,
                marginRight: 0
              },
              "& .MuiOutlinedInput-root": {
                "& legend": {
                  display: "none"
                },
                fontSize: "0.9rem",
                ...props
              },
              "& .MuiOutlinedInput-input": {
                paddingBottom: "8px"
              },
              "& .MuiInputLabel-root": {
                transition: "all 0.2s ease-in-out"
              },
              "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
                {
                  transform: "translate(12px, 0px) scale(.75)"
                },
              "& .MuiInputAdornment-root": {
                marginRight: "4px"
              }
            }
          },
          popper: {
            anchorEl: () => datetimeInputRef.current,
            disablePortal: true,
            placement: "bottom-end",
            sx: {
              zIndex: 1700
            }
          },
          desktopPaper: {
            sx: {
              maxHeight: "290px",
              margin: "8px 0",
              px: "8px",
              borderRadius: "12px",
              boxShadow:
                "0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.03),0px 3px 14px 2px rgba(0, 0, 0, 0.05)"
            }
          },
          layout: {
            sx: {
              "& .MuiDivider-root": {
                display: "none !important"
              },
              "& .MuiDialogActions-root": {
                display: "none"
              },
              "& .MuiTimeClock-arrowSwitcher": {
                display: "none"
              },
              "& .MuiPickersLayout-toolbar": {
                gridColumn: "1 / span 2",
                gap: 0.25
              },
              "& .MuiPickersToolbar-content": {
                gap: 1,
                flexDirection: "column"
              },
              "& .MuiPickersToolbar-root-MuiDateTimePickerToolbar-root": {
                paddingLeft: "0px !important",
                paddingRight: "0px !important"
              },
              "& .MuiPickersCalendarHeader-root": {
                padding: {
                  xs: 0,
                  sm: "0 8px"
                },
                justifyContent: {
                  xs: "space-around",
                  sm: "space-between"
                },
                "& .MuiPickersArrowSwitcher-button": {
                  color: "primary.dark",
                  ":disabled": {
                    color: "#9e9e9e"
                  }
                },
                "& .MuiPickersCalendarHeader-labelContainer": {
                  pointerEvents: "none",
                  fontSize: "0.9rem"
                },
                "& .MuiPickersCalendarHeader-switchViewButton": {
                  display: "none"
                }
              },
              "& .MuiPickersCalendarHeader-labelContainer": {
                marginRight: 0
              },
              "& .MuiPickersLayout-contentWrapper": {
                gridColumn: "1 / span 2",
                alignItems: "center"
              },
              "& .MuiDateTimePickerTabs-root": {
                width: "100%"
              },
              "& .MuiDateCalendar-root": {
                margin: 0,
                padding: "0px 8px 8px 8px",
                width: "100%",
                height: "100%"
              },
              "& .MuiClockPointer-thumb": {
                backgroundColor: "primary.dark",
                border: "16px solid #598aff"
              },
              "& .MuiTimeClock-root": {
                maxWidth: "254px",
                maxHeight: "260px"
              },
              "& .MuiDayCalendar-slideTransition": {
                xs: {
                  minHeight: 0
                },
                sm: {
                  minHeight: "230px"
                }
              },
              "& .MuiDayCalendar-header": {
                "& .MuiDayCalendar-weekDayLabel": {
                  width: "26px",
                  height: "26px",
                  fontSize: "0.7rem",
                  fontWeight: 600
                }
              },
              "& .MuiDayCalendar-weekContainer": {
                margin: "5px 0",
                "& .MuiPickersDay-root": {
                  width: "26px",
                  height: "26px",
                  fontSize: "0.7rem"
                },
                ".MuiPickersDay-root.Mui-selected": {
                  backgroundColor: "primary.dark"
                }
              },
              "& .MuiTabs-flexContainer .MuiSvgIcon-root": {
                width: "1.3rem",
                height: "1.3rem"
              }
            }
          },
          openPickerButton: {
            sx: {
              padding: "5px"
            }
          },
          openPickerIcon: {
            sx: {
              fontSize: "1.3rem",
              color: "primary.main"
            }
          },
          previousIconButton: {
            sx: {
              padding: "4px"
            }
          },
          nextIconButton: {
            sx: {
              padding: "4px"
            }
          },
          day: {
            sx: {
              width: "30px",
              height: "30px",
              fontWeight: 500,
              ":not(.Mui-disabled):not(.Mui-selected)": {
                backgroundColor: "#F2F6FF",
                color: "#477cfc",
                ":hover": {
                  backgroundColor: "#e6eeff"
                }
              }
            }
          },
          toolbar: {
            sx: {
              padding: "16px 24px 8px 24px",
              "& .MuiDateTimePickerToolbar-dateContainer .MuiPickersToolbarText-root":
                {
                  fontSize: "1rem !important"
                },
              "& .MuiDateTimePickerToolbar-dateContainer": {
                gap: 1,
                flexDirection: "row-reverse",
                alignItems: "center"
              },
              "& .MuiDateTimePickerToolbar-dateContainer > :first-of-type": {
                pointerEvents: "none"
              }
            }
          },
          mobilePaper: {
            sx: {
              "@media (max-width: 299px)": {
                minWidth: "calc(100vw - 32px) !important"
              },
              minWidth: "260px !important",
              borderRadius: "12px"
            }
          }
        }}
      />
    </LocalizationProvider>
  )
}
