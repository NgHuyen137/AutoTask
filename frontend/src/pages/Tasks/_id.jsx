import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import { useTaskState } from "~/hooks/useState"
import { useFetchTaskById } from "~/hooks/useQuery"
import { useDeleteTask, useUpdateTask } from "~/hooks/useMutation"
import { useClickOutsideMoreOptionsPopper } from "~/hooks/useEffect"

import ControlBar from "~/components/ui/ControlBar"

import Box from "@mui/material/Box"
import Spinner from "~/components/ui/Spinner"
import TaskDetails from "~/components/TaskDetails/TaskDetails"
import { set } from "lodash"

export default function TaskID() {
  const { id } = useParams()
  const { data: taskData } = useFetchTaskById(id)
  const { task, updateTask } = useTaskState()

  const location = useLocation()
  const navigate = useNavigate()

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openMoreOptions, setOpenMoreOptions] = useState(false)
  const [moreOptionsAnchor, setMoreOptionsAnchor] = useState(null)
  const moreOptionsPaperRef = useRef(null)

  const {
    updateSingleTask,
    isSuccess: isUpdatedTask,
    reset: resetUpdateTask
  } = useUpdateTask()
  const {
    deleteSingleTask,
    isLoading: isDeletingTask,
    isSuccess: isDeletedTask,
    reset: resetDeleteTask
  } = useDeleteTask()

  useClickOutsideMoreOptionsPopper(
    moreOptionsAnchor,
    moreOptionsPaperRef,
    setMoreOptionsAnchor,
    openDeleteDialog
  )

  const handleOpenEditTask = () => {
    const currentPath = location.pathname
    navigate(`${currentPath}/edit`)
  }

  const handleMarkTaskDone = () => {
    setMoreOptionsAnchor(null)
    updateTask("status", 1) // Update local state
    const updatedTaskData = { status: 1 }
    updateSingleTask(
      { id: id, updatedTaskData },
      {
        onError: () => {
          updateTask("status", 0)
        }
      }
    )
  }

  const handleMarkTaskIncomplete = () => {
    setMoreOptionsAnchor(null)
    updateTask("status", 0)
    const updatedTaskData = { status: 0 }
    updateSingleTask(
      { id: id, updatedTaskData },
      {
        onError: () => {
          updateTask("status", 1)
        }
      }
    )
  }

  const handleDeleteTask = () => {
    deleteSingleTask({ id })
  }

  const handleOpenMoreOptions = (event) => {
    setMoreOptionsAnchor(event.currentTarget)
  }

  const handleOpenDeleteDialog = () => {
    setMoreOptionsAnchor(null)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  const handleCloseTask = () => {
    navigate(`/tasks${location.search}`)
  }

  useEffect(() => {
    if (isDeletedTask) {
      resetDeleteTask()
      setOpenDeleteDialog(false)
      navigate(`/tasks${location.search}`) // Back to Tasks page
    }
  }, [isDeletedTask])

  useEffect(() => {
    if (isUpdatedTask) {
      resetUpdateTask()
    }
  }, [isUpdatedTask])

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
      updateTask("startDate", taskData.start_date)
      updateTask("dueDate", taskData.due_date)
    }
  }, [taskData])

  if (!taskData) return <Spinner />

  return (
    <Box
      sx={{
        margin: "0 auto",
        py: 2,
        minWidth: {
          xs: "100%",
          sm: "600px",
          md: "800px"
        }
      }}
    >
      <ControlBar
        taskStatus={task.status}
        onMarkTaskDone={handleMarkTaskDone}
        onMarkTaskIncomplete={handleMarkTaskIncomplete}
        onOpenEditTask={handleOpenEditTask}
        openMoreOptions={Boolean(moreOptionsAnchor)}
        onOpenMoreOptions={handleOpenMoreOptions}
        moreOptionsAnchor={moreOptionsAnchor}
        moreOptionsPaperRef={moreOptionsPaperRef}
        openDeleteDialog={openDeleteDialog}
        onOpenDeleteDialog={handleOpenDeleteDialog}
        onCloseDeleteDialog={handleCloseDeleteDialog}
        deleteName={task.name}
        isDeleting={isDeletingTask}
        isDeleted={isDeletedTask}
        onDeleteTask={handleDeleteTask}
        onCloseTask={handleCloseTask}
      />
      <TaskDetails task={task} />
    </Box>
  )
}
