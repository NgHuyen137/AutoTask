import { useEffect, useState } from "react"
import { usePlannerContext } from "~/hooks/useContext"
import { useTaskState } from "~/hooks/useState"
import { useUpdateTask, useDeleteTask } from "~/hooks/useMutation"
import CustomSubmitButton from "~/components/ui/CustomSubmitButton"
import CustomDeleteDialog from "~/components/ui/CustomDeleteDialog"
import TaskDetailsUpdate from "./TaskDetailsUpdate/TaskDetailsUpdate"
import TaskSchedulingUpdate from "./TaskSchedulingUpdate/TaskSchedulingUpdate"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"

export default function TaskUpdate({ taskSidebarRef }) {
  const {
    setOpenTaskSidebar,
    targetTask,
    setTargetTask,
    setOpenUpdate,
    setTaskSidebarWidth
  } = usePlannerContext()
  const {
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
    startAt,
    endAt,
    startDate,
    dueDate,
    createdAt
  } = targetTask

  const defaultTaskSidebarWidth = 480

  const { task, updateTask } = useTaskState() // Used for storing updated data only
  const { updateSingleTask, isLoading, isSuccess, reset } = useUpdateTask()
  const {
    deleteSingleTask,
    isLoading: isDeletingTask,
    isSuccess: isDeletedTask,
    reset: resetDeleteTask
  } = useDeleteTask()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  // Manage errors when updating
  const [taskNameError, setTaskNameError] = useState(false)
  const [startDatetimeError, setStartDatetimeError] = useState(false)
  const [endDatetimeError, setEndDatetimeError] = useState(false)
  const [startDateError, setStartDateError] = useState(false)
  const [dueDateError, setDueDateError] = useState(false)

  useEffect(() => {
    // Get existing task data to display on Update screen
    updateTask("name", name)
    updateTask("status", status)
    updateTask("priority", priority)
    updateTask("tags", tags)
    updateTask("description", description)
    updateTask("smartScheduling", smartScheduling)
    updateTask("schedulingHour", schedulingHour)
    updateTask("duration", duration)
    updateTask("split", split)
    updateTask("startAt", startAt)
    updateTask("endAt", endAt)
    updateTask("startDate", startDate)
    updateTask("dueDate", dueDate)
  }, [targetTask])

  const handleUpdateTask = () => {
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
          startDateError ||
          dueDateError)) ||
      (!task.smartScheduling && (startDatetimeError || endDatetimeError))
    )
      return

    // Create updated data
    const updatedTaskData = {
      name: task.name,
      status: task.status,
      priority: task.priority,
      tags: task.tags,
      description: task.description,
      smart_scheduling: task.smartScheduling,
      start_date: task.smartScheduling ? task.startDate : null,
      due_date: task.smartScheduling ? task.dueDate : null,
      scheduling_hour_id: task.smartScheduling ? task.schedulingHour : null,
      duration: task.smartScheduling ? task.duration : null,
      split: task.smartScheduling ? task.split : null,
      created_at: createdAt,
      time_allocations: [
        {
          start_at: task.startAt,
          end_at: task.endAt,
          is_scheduled_ontime: true
        }
      ]
    }

    // Update task
    updateSingleTask({ id: id, updatedTaskData })

    setOpenUpdate(false)
    localStorage.setItem("openUpdate", false)
    setOpenTaskSidebar(false)
    localStorage.setItem("openTaskSidebar", false)
    setTargetTask(null)
    localStorage.setItem("targetTask", null)

    reset()
  }

  const handleDeleteTask = () => {
    setOpenUpdate(false)
    localStorage.setItem("openUpdate", false)
    setOpenTaskSidebar(false)
    localStorage.setItem("openTaskSidebar", false)
    setTaskSidebarWidth(defaultTaskSidebarWidth)
    localStorage.setItem("taskSidebarWidth", defaultTaskSidebarWidth)
    setTargetTask(null)
    localStorage.setItem("targetTask", null)

    setTimeout(() => {
      deleteSingleTask({ id })
      resetDeleteTask()
    }, 1000)
  }

  return (
    <Box sx={{ padding: "0 8px", maxWidth: "800px", alignSelf: "center" }}>
      <TaskDetailsUpdate
        taskSidebarRef={taskSidebarRef}
        taskState={{ task, updateTask }}
        taskNameErrorState={{ taskNameError, setTaskNameError }}
      />

      <TaskSchedulingUpdate
        taskSidebarRef={taskSidebarRef}
        taskState={{ task, updateTask }}
        startDatetimeErrorState={{
          datetimeError: startDatetimeError,
          setDatetimeError: setStartDatetimeError
        }}
        endDatetimeErrorState={{
          datetimeError: endDatetimeError,
          setDatetimeError: setEndDatetimeError
        }}
        startDateErrorState={{
          datetimeError: startDateError,
          setDatetimeError: setStartDateError
        }}
        dueDateErrorState={{
          datetimeError: dueDateError,
          setDatetimeError: setDueDateError
        }}
      />

      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "center",
          backgroundColor: "#F7F8FC",
          position: "sticky",
          bottom: 0,
          padding: "16px 0",
          marginTop: "24px",
          zIndex: 1600
        }}
      >
        <CustomSubmitButton
          buttonName="Save"
          handleClick={handleUpdateTask}
          isLoading={isLoading}
          isSuccess={isSuccess}
          props={{ flex: 1, height: "50px" }}
        />

        <CustomSubmitButton
          buttonName="Cancel"
          handleClick={() => {
            setOpenUpdate(false)
            localStorage.setItem("openUpdate", false)
          }}
          props={{
            flex: 1,
            height: "50px",
            color: "primary.dark",
            boxShadow: "none !important",
            backgroundColor: "#F7F8FC",
            ":hover": {
              boxShadow: "none !important",
              backgroundColor: "#e5edff !important"
            }
          }}
        />
      </Box>

      <Box
        sx={{
          columnGap: 1,
          padding: 2,
          marginTop: 2,
          display: "grid",
          alignItems: "center",
          gridTemplateRows: "auto auto",
          gridTemplateColumns: "1fr auto",
          borderRadius: "8px",
          border: "1px solid #E7E8EC"
        }}
      >
        <Typography
          fontSize="1rem"
          fontWeight={600}
          sx={{
            gridRow: 1,
            gridColumn: 1
          }}
        >
          Delete Task
        </Typography>
        <Typography
          fontSize="0.9rem"
          sx={{
            gridRow: 2,
            gridColumn: 1
          }}
        >
          If you no longer want to keep this Task, you can delete it.
        </Typography>
        <Button
          onClick={() => setOpenDeleteDialog(true)}
          startIcon={<DeleteOutlinedIcon sx={{ color: "#DD5555" }} />}
          sx={{
            gridRow: "1 / -1",
            gridColumn: 2,
            color: "#DD5555",
            borderRadius: "40px",
            textTransform: "none",
            backgroundColor: "#F7F8FC",
            ":hover": {
              backgroundColor: "#F6F2F6"
            }
          }}
        >
          Delete Task
        </Button>
        {openDeleteDialog && (
          <CustomDeleteDialog
            openDeleteDialogState={{
              openDeleteDialog,
              setOpenDeleteDialog
            }}
            taskName={targetTask.name}
            isDeletingTask={isDeletingTask}
            isDeletedTask={isDeletedTask}
            handleDeleteTask={handleDeleteTask}
          />
        )}
      </Box>
    </Box>
  )
}
