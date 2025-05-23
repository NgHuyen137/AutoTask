import { useState, useEffect } from "react"
import { useTaskState } from "~/hooks/useState"
import { usePlannerContext } from "~/hooks/useContext"
import { useCreateNewTask } from "~/hooks/useMutation"
import { useMediaQuery } from "@mui/material"
import {
  TaskName,
  TaskDescription
} from "~/components/TaskComponents/TextInput/TextInput"
import { CompactTagsInput } from "~/components/TaskComponents/TagsInput/TagsInput"
import PrioritySelector from "~/components/TaskComponents/PrioritySelector/PrioritySelector"
import CustomTimePicker from "~/components/TaskComponents/TimePicker/TimePicker"
import CustomSubmitButton from "~/components/ui/CustomSubmitButton"
import Box from "@mui/material/Box"
import Popper from "@mui/material/Popper"
import Grow from "@mui/material/Grow"
import Paper from "@mui/material/Paper"
import FormControl from "@mui/material/FormControl"
import Typography from "@mui/material/Typography"

export default function TaskCreatePopup({ popperRef, anchorEl, calendarRef }) {
  const {
    showTaskCreatePopup,
    setShowTaskCreatePopup,
    enterTaskCreatePopup,
    setEnterTaskCreatePopup,
    startDateTime,
    setStartDateTime,
    endDateTime,
    setEndDateTime
  } = usePlannerContext()

  const isLessThan400 = useMediaQuery("(max-width: 399px)")
  const isLessThan750 = useMediaQuery("(max-width: 749px)")

  const { task, updateTask } = useTaskState()
  const [isTagsOverflow, setIsTagsOverflow] = useState(false)

  // Manage errors
  const [taskNameError, setTaskNameError] = useState(false)
  const [startTimeError, setStartTimeError] = useState(false)
  const [endTimeError, setEndTimeError] = useState(false)

  const { createNewTask, isSuccess, isLoading, reset } = useCreateNewTask()

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        event.button !== 0 ||
        event.target.classList.contains("MuiBackdrop-root") ||
        event.target.querySelector(".MuiBackdrop-root") ||
        event.target.classList.contains("MuiList-root") ||
        event.target.classList.contains("MuiMenuItem-root")
      )
        return

      if (popperRef?.current && !popperRef.current.contains(event.target))
        setEnterTaskCreatePopup(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  })

  const handleCreateNewTask = () => {
    // Validate data
    if (task.name.length === 0) {
      setTaskNameError(true)
      return
    }
    setTaskNameError(false)

    if (startTimeError || endTimeError) return

    // Create data to add to DB
    const newTaskData = {
      name: task.name,
      priority: task.priority,
      time_allocations: [
        {
          start_at: startDateTime,
          end_at: endDateTime,
          is_scheduled_ontime: true
        }
      ],
      tags: task.tags,
      description: task.description
    }

    // Create new task
    createNewTask(newTaskData)

    // Close TaskCreateForm & old selection
    setEnterTaskCreatePopup(false)
  }

  const getTransformOrigin = (placement) => {
    if (showTaskCreatePopup)
      return placement === "right" ? "left center" : "right center"
    return placement === "right" ? "center left" : "center right"
  }

  if (!showTaskCreatePopup || !anchorEl.current) return null

  return (
    <Popper
      sx={(theme) => ({ zIndex: theme.zIndex.tooltip })}
      open={showTaskCreatePopup}
      anchorEl={anchorEl.current}
      placement="right"
      disablePortal
      transition
      onMouseDown={(event) => event.stopPropagation()}
      modifiers={[
        {
          name: "flip",
          options: {
            fallbackPlacements: ["left"],
            boundary: calendarRef.current
          }
        },
        {
          name: "preventOverflow",
          options: {
            padding: 16,
            altAxis: isLessThan750 ? true : false,
            boundary: isLessThan400 ? "window" : calendarRef.current
          }
        },
        {
          name: "eventListeners",
          options: {
            scroll: true,
            resize: true
          }
        }
      ]}
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          mountOnEnter
          unmountOnExit
          timeout={350}
          style={{ transformOrigin: getTransformOrigin(placement) }}
          in={enterTaskCreatePopup}
          onExited={() => {
            queueMicrotask(() => {
              const calendarApi = calendarRef.current?.getApi()
              calendarApi.unselect()
            })

            setShowTaskCreatePopup(false)

            // Reset task state
            reset()
            setTaskNameError(false)
            setStartTimeError(false)
            setEndTimeError(false)
            updateTask("name", "")
            updateTask("priority", 1)
            updateTask("tags", [])
            updateTask("description", "")
            setStartDateTime(null)
            setEndDateTime(null)
          }}
        >
          <Paper
            ref={popperRef}
            sx={{
              "@media (max-width: 371px)": {
                width: "calc(100vw - 32px)",
                overflow: "auto"
              },
              maxHeight: "500px",
              maxWidth: "340px",
              minWidth: "230px",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              boxShadow:
                "0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.03),0px 3px 14px 2px rgba(0, 0, 0, 0.05)"
            }}
          >
            <Box
              sx={{
                height: "54px",
                padding: "24px 16px 0px 16px",
                borderRadius: "12px 12px 0 0"
              }}
            >
              <Typography
                variant="h1"
                fontWeight={510}
                color="primary.dark"
                sx={{ wordSpacing: "2px" }}
              >
                Create New Task
              </Typography>
            </Box>

            <FormControl
              sx={{ width: "100%", flexGrow: 1, gap: 2, padding: 2 }}
            >
              <FormControl>
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                  <TaskName
                    taskNameErrorState={{ taskNameError, setTaskNameError }}
                    taskState={{ task, updateTask }}
                    props={{ height: "40px" }}
                    boxProps={{ flex: 1 }}
                  />
                  <PrioritySelector
                    taskState={{ task, updateTask }}
                    props={{ marginLeft: "auto" }}
                  />
                </Box>
              </FormControl>

              <CompactTagsInput
                taskState={{ task, updateTask }}
                tagsOverflowState={{ isTagsOverflow, setIsTagsOverflow }}
                props={{
                  popperWidth: `calc(${popperRef.current?.clientWidth}px - 32px)`,

                  // The scrollWidth property of Tag Stack must be greater than minScrollWidth to be considered Overflow
                  // 126 is the total of Tag Input's width, and Padding
                  minScrollWidth: popperRef.current?.clientWidth - 136,

                  // Space for adding the next button when tags are overflow
                  // 64px is the total of Tag Input's width, Padding, and Space for the next button
                  autoCompleteMaxWidth: `calc(${popperRef.current?.clientWidth}px - 64px)`
                }}
              />
              <TaskDescription
                taskState={{ task, updateTask }}
                props={{ flex: 2 }}
              />

              <Box sx={{ display: "flex", gap: 1 }}>
                <CustomTimePicker
                  calendarRef={calendarRef}
                  label="Start time"
                  timeErrorState={{
                    timeError: startTimeError,
                    setTimeError: setStartTimeError
                  }}
                />
                <CustomTimePicker
                  calendarRef={calendarRef}
                  label="End time"
                  timeErrorState={{
                    timeError: endTimeError,
                    setTimeError: setEndTimeError
                  }}
                />
              </Box>

              <CustomSubmitButton
                buttonName="Create"
                handleClick={handleCreateNewTask}
                isLoading={isLoading}
                isSuccess={isSuccess}
              />
            </FormControl>
          </Paper>
        </Grow>
      )}
    </Popper>
  )
}
