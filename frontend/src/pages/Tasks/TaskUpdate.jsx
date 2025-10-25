import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useTaskState } from "~/hooks/useState"
import { useFetchTaskById } from "~/hooks/useQuery"
import { useUpdateTask, useDeleteTask } from "~/hooks/useMutation"

import CustomSubmitButton from "~/components/ui/CustomSubmitButton"
import CustomDeleteDialog from "~/components/ui/CustomDeleteDialog"
import TaskDetailsUpdate from "~/components/TaskDetailsUpdate/TaskDetailsUpdate"
import TaskSchedulingUpdate from "~/components/TaskSchedulingUpdate/TaskSchedulingUpdate"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import Spinner from "~/components/ui/Spinner"

export default function TaskUpdate() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: taskData } = useFetchTaskById(id)
  const { task, updateTask } = useTaskState() // Used for storing updated data only
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const {
    updateSingleTask,
    isLoading: isUpdatingTask,
    isSuccess: isUpdatedTask,
    reset: resetUpdateTask
  } = useUpdateTask()
  const {
    deleteSingleTask,
    isLoading: isDeletingTask,
    isSuccess: isDeletedTask,
    reset: resetDeleteTask
  } = useDeleteTask()

  // Manage errors when updating
  const [taskNameError, setTaskNameError] = useState(false)
  const [startDatetimeError, setStartDatetimeError] = useState(false)
  const [endDatetimeError, setEndDatetimeError] = useState(false)
  const [startDateError, setStartDateError] = useState(false)
  const [dueDateError, setDueDateError] = useState(false)

  useEffect(() => {
    if (taskData) {
      updateTask("name", taskData.name)
      updateTask("status", taskData.status)
      updateTask("priority", taskData.priority)
      updateTask("tags", taskData.tags)
      updateTask("description", taskData.description)
      updateTask("smartScheduling", taskData.smart_scheduling)
      updateTask("schedulingHour", taskData.scheduling_hour_id)
      updateTask("duration", taskData.duration)
      updateTask("split", taskData.split)
      updateTask("startDate", dayjs(taskData.start_date))
      updateTask("dueDate", dayjs(taskData.due_date))

      if (!taskData.smartScheduling) {
        updateTask("startAt", dayjs(taskData.time_allocations[0].start_at))
        updateTask("endAt", dayjs(taskData.time_allocations[0].end_at))
      }
    }
  }, [taskData])

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
  }

  const handleDeleteTask = () => {
    deleteSingleTask({ id })
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  useEffect(() => {
    if (isUpdatedTask) {
      resetUpdateTask()
      navigate(`/tasks/${id}`)
    }
  }, [isUpdatedTask])

  useEffect(() => {
    if (isDeletedTask) {
      resetDeleteTask()
      navigate(`/tasks/${id}`)
    }
  }, [isDeletedTask])

  if (!taskData) return <Spinner />

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto"
      }}
    >
      <Box
        sx={{
          margin: "0 auto",
          padding: "24px",
          maxWidth: "800px",
          boxSizing: "border-box"
        }}
      >
        <TaskDetailsUpdate
          taskState={{ task, updateTask }}
          taskNameErrorState={{ taskNameError, setTaskNameError }}
        />

        <TaskSchedulingUpdate
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
            isLoading={isUpdatingTask}
            isSuccess={isUpdatedTask}
            props={{ flex: 1, height: "50px" }}
          />

          <CustomSubmitButton
            buttonName="Cancel"
            handleClick={() => {
              navigate(`/tasks/${id}`)
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
              openDeleteDialog={openDeleteDialog}
              onCloseDeleteDialog={handleCloseDeleteDialog}
              name={task.name}
              isDeleting={isDeletingTask}
              isDeleted={isDeletedTask}
              onDelete={handleDeleteTask}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}
