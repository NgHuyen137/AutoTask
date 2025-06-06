import { useEffect, useState } from "react"
import { useTaskState } from "~/hooks/useState"
import { useFetchAllSchedulingHours } from "~/hooks/useQuery"
import { usePlannerContext } from "~/hooks/useContext"
import { useCreateNewTask } from "~/hooks/useMutation"
import { useMediaQuery } from "@mui/material"
import {
  TaskName,
  TaskDescription
} from "~/components/TaskComponents/TextInput/TextInput"
import { CompactTagsInput } from "~/components/TaskComponents/TagsInput/TagsInput"
import PrioritySelector from "~/components/TaskComponents/PrioritySelector/PrioritySelector"
import SchedulingHourSelector from "~/components/TaskComponents/SchedulingHourSelector/SchedulingHourSelector"
import DurationInput from "~/components/TaskComponents/DurationInput/DurationInput"
import DateTimePicker from "~/components/TaskComponents/DateTimePicker/DateTimePicker"
import CustomSubmitButton from "~/components/ui/CustomSubmitButton"
import Box from "@mui/material/Box"
import Popper from "@mui/material/Popper"
import Grow from "@mui/material/Grow"
import Paper from "@mui/material/Paper"
import FormControl from "@mui/material/FormControl"
import Typography from "@mui/material/Typography"
import Switch from "@mui/material/Switch"
import IconButton from "@mui/material/IconButton"
import Collapse from "@mui/material/Collapse"
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded"
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded"
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded"

export default function TaskCreateButton({ buttonRef, taskCreateFormRef }) {
  const isLessThan400 = useMediaQuery("(max-width: 399px)")
  const isLessThan330 = useMediaQuery("(max-width: 329px)")

  const {
    showTaskCreateForm,
    setShowTaskCreateForm,
    enterTaskCreateForm,
    setEnterTaskCreateForm
  } = usePlannerContext()

  const { task, updateTask } = useTaskState()
  const [split, setSplit] = useState(false)
  const [isTagsOverflow, setIsTagsOverflow] = useState(false)

  // Manage errors
  const [taskNameError, setTaskNameError] = useState(false)
  const [startDatetimeError, setStartDatetimeError] = useState(false)
  const [endDatetimeError, setEndDatetimeError] = useState(false)
  const [startDateError, setStartDateError] = useState(false)
  const [dueDateError, setDueDateError] = useState(false)

  const { createNewTask, isSuccess, isLoading, reset } = useCreateNewTask()
  const schedulingHours = useFetchAllSchedulingHours()

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        event.button !== 0 ||
        event.target.classList.contains("MuiBackdrop-root") ||
        event.target.querySelector(".MuiBackdrop-root") ||
        event.target.classList.contains("MuiList-root") ||
        event.target.classList.contains("MuiMenuItem-root") ||
        buttonRef.current?.contains(event.target)
      )
        return

      if (
        taskCreateFormRef?.current &&
        !taskCreateFormRef.current.contains(event.target)
      )
        setEnterTaskCreateForm(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const resetTaskState = () => {
    setSplit(false)
    setTaskNameError(false)
    setStartDatetimeError(false)
    setEndDatetimeError(false)
    setStartDateError(false)
    setDueDateError(false)
    updateTask("name", "")
    updateTask("priority", 1)
    updateTask("tags", [])
    updateTask("smartScheduling", false)
    updateTask("startAt", null)
    updateTask("endAt", null)
    updateTask("startDate", null)
    updateTask("dueDate", null)
    updateTask("schedulingHour", null)
    updateTask("split", null)
    updateTask("duration", null)
    updateTask("description", "")
  }

  const handleCreateNewTask = () => {
    // Validate data
    if (task.name.length === 0) {
      setTaskNameError(true)
      return
    }
    setTaskNameError(false)

    if (
      (task.smartScheduling &&
        (!task.duration ||
          task.duration === 0 ||
          startDatetimeError ||
          endDatetimeError)) ||
      (!task.smartScheduling && (startDateError || dueDateError))
    )
      return

    // Create data to add to DB
    const newTaskData = {
      name: task.name,
      priority: task.priority,
      tags: task.tags,
      description: task.description,
      smart_scheduling: task.smartScheduling,
      start_date: task.smartScheduling ? task.startDate : null,
      due_date: task.smartScheduling ? task.dueDate : null,
      scheduling_hour_id: task.smartScheduling ? task.schedulingHour : null,
      duration: task.smartScheduling ? task.duration : null,
      split: task.smartScheduling ? task.split : null,
      ...(task.smartScheduling === false && {
        time_allocations: [
          {
            start_at: task.startAt,
            end_at: task.endAt,
            is_scheduled_ontime: true
          }
        ]
      })
    }

    // Create new task
    createNewTask(newTaskData)

    resetTaskState()
    setTimeout(() => reset(), 3000)
  }

  if (!showTaskCreateForm) return null

  return (
    <Popper
      sx={(theme) => ({ zIndex: theme.zIndex.tooltip })}
      open={showTaskCreateForm}
      anchorEl={buttonRef.current}
      placement="bottom-end"
      disablePortal
      transition
      onMouseDown={(event) => event.stopPropagation()}
      modifiers={[
        {
          name: "preventOverflow",
          options: {
            padding: 16,
            altAxis: true,
            boundary: "window"
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
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          mountOnEnter
          unmountOnExit
          timeout={350}
          style={{
            transformOrigin: showTaskCreateForm ? "top right" : "top left"
          }}
          in={enterTaskCreateForm}
          onExited={() => {
            setShowTaskCreateForm(false)

            // Reset task state
            reset()
            resetTaskState()
          }}
        >
          <Paper
            ref={taskCreateFormRef}
            sx={{
              "@media (max-width: 432px)": {
                width: "calc(100vw - 32px)",
                overflow: "auto"
              },
              minWidth: "248px",
              maxWidth: "400px",
              maxHeight: "90vh",
              borderRadius: "12px",
              margin: "8px 0px",
              display: "flex",
              flexDirection: "column",
              boxShadow:
                "0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.03),0px 3px 14px 2px rgba(0, 0, 0, 0.05)"
            }}
          >
            <FormControl
              sx={{ width: "100%", flexGrow: 1, gap: 2, padding: 2 }}
            >
              <FormControl>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-start"
                  }}
                >
                  <TaskName
                    taskNameErrorState={{ taskNameError, setTaskNameError }}
                    taskState={{ task, updateTask }}
                    props={{ height: "40px" }}
                    boxProps={{ flex: isLessThan400 ? 2 : 1 }}
                  />
                  <PrioritySelector
                    taskState={{ task, updateTask }}
                    props={{
                      marginLeft: "auto",
                      flex: isLessThan400 ? 1 : "none"
                    }}
                  />
                </Box>
              </FormControl>

              <CompactTagsInput
                taskCreateFormRef={taskCreateFormRef}
                taskState={{ task, updateTask }}
                tagsOverflowState={{ isTagsOverflow, setIsTagsOverflow }}
                props={{
                  popperWidth: `calc(${taskCreateFormRef.current?.clientWidth}px - 32px)`,

                  // The scrollWidth property of Tag Stack must be greater than minScrollWidth to be considered Overflow
                  // 126 is the total of Tag Input's width, and Padding
                  minScrollWidth: taskCreateFormRef.current?.clientWidth - 136,

                  // Space for adding the next button when tags are overflow
                  // 64px is the total of Tag Input's width, Padding, and Space for the next button
                  autoCompleteMaxWidth: `calc(${taskCreateFormRef.current?.clientWidth}px - 64px)`
                }}
              />
              <TaskDescription taskState={{ task, updateTask }} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  padding: "16px",
                  borderRadius: "4px",
                  boxShadow: "0 0 4px 0px rgba(200, 200, 201, 0.3)"
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    marginBottom: 1.8
                  }}
                >
                  <AutoAwesomeRoundedIcon sx={{ color: "primary.main" }} />
                  {!isLessThan330 && (
                    <Typography
                      variant="h2"
                      fontWeight={420}
                      color="text.primary"
                    >
                      Smart scheduling
                    </Typography>
                  )}
                  <Switch
                    checked={task.smartScheduling}
                    onChange={(event) =>
                      updateTask("smartScheduling", event.target.checked)
                    }
                    onMouseDown={(event) => event.preventDefault()}
                  />
                </Box>

                <Collapse in={!task.smartScheduling} timeout={350}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isLessThan400 ? "column" : "row",
                      gap: 2,
                      marginBottom: 1.8
                    }}
                  >
                    <DateTimePicker
                      label="Start datetime"
                      taskState={{ task, updateTask }}
                      datetimeErrorState={{
                        datetimeError: startDatetimeError,
                        setDatetimeError: setStartDatetimeError
                      }}
                    />
                    <DateTimePicker
                      label="End datetime"
                      taskState={{ task, updateTask }}
                      datetimeErrorState={{
                        datetimeError: endDatetimeError,
                        setDatetimeError: setEndDatetimeError
                      }}
                    />
                  </Box>
                </Collapse>

                <Collapse in={task.smartScheduling} timeout={350}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: 1.8,
                      gap: 1.5
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: isLessThan400 ? "column" : "row",
                        gap: isLessThan400 ? 2 : 1
                      }}
                    >
                      <DateTimePicker
                        label="Start date"
                        taskState={{ task, updateTask }}
                        datetimeErrorState={{
                          datetimeError: startDateError,
                          setDatetimeError: setStartDateError
                        }}
                      />
                      <DateTimePicker
                        label="Due date"
                        taskState={{ task, updateTask }}
                        datetimeErrorState={{
                          datetimeError: dueDateError,
                          setDatetimeError: setDueDateError
                        }}
                      />
                    </Box>
                    <SchedulingHourSelector
                      schedulingHours={schedulingHours}
                      taskState={{ task, updateTask }}
                    />
                    <Box sx={{ display: "flex" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginRight: "auto",
                          gap: 0.5
                        }}
                      >
                        <IconButton
                          onClick={() => setSplit((prev) => !prev)}
                          sx={{ padding: "4px" }}
                        >
                          {!split ? (
                            <CheckBoxOutlineBlankRoundedIcon
                              sx={{ color: "primary.main" }}
                            />
                          ) : (
                            <CheckBoxRoundedIcon
                              sx={{ color: "primary.main" }}
                            />
                          )}
                        </IconButton>
                        <Typography variant="h2" fontWeight={420}>
                          Split up
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: isLessThan400 ? "column" : "row",
                        gap: isLessThan400 ? 2 : 1
                      }}
                    >
                      <DurationInput
                        props={{
                          label: "Duration",
                          updateField: "duration",
                          split: split
                        }}
                        taskState={{ task, updateTask }}
                      />
                      <DurationInput
                        props={{
                          label: "Min duration",
                          updateField: "split",
                          split: split
                        }}
                        taskState={{ task, updateTask }}
                      />
                    </Box>
                  </Box>
                </Collapse>

                <CustomSubmitButton
                  buttonName="Create"
                  handleClick={handleCreateNewTask}
                  isLoading={isLoading}
                  isSuccess={isSuccess}
                />
              </Box>
            </FormControl>
          </Paper>
        </Grow>
      )}
    </Popper>
  )
}
