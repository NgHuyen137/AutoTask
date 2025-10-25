import { useState, useEffect, useRef, use } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import {
  useDeleteTask,
  useDeleteMultipleTasks,
  useUpdateTask,
  useUpdateMultipleTasks
} from "~/hooks/useMutation"
import {
  useClickOutsideMoreOptionsPopper,
  useHeightObserver
} from "~/hooks/useEffect"

import taskNotFoundImage from "~/assets/images/task_not_found.png"

import PaginationBar from "~/components/ui/PaginationBar"
import MoreOptionsMenu from "~/components/ui/MoreOptionsMenu"
import MoreOptionsButton from "~/components/ui/MoreOptionsButton"
import CustomDeleteDialog from "~/components/ui/CustomDeleteDialog"

import { grey } from "@mui/material/colors"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import Collapse from "@mui/material/Collapse"
import Typography from "@mui/material/Typography"
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded"
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded"
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded"
import CustomMenu from "~/components/ui/CustomMenu"

const iconAndTextColorMapping = {
  0: "#b8b8b8",
  1: "#c0d492",
  2: "#fbc4ab",
  3: "#f4978e"
}

const priorityOptions = [
  { label: "Low", value: 0 },
  { label: "Medium", value: 1 },
  { label: "High", value: 2 },
  { label: "ASAP", value: 3 }
]

const PriorityIcon = (props) => {
  return (
    <svg
      className="w-6 h-6 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill={props?.color || "currentColor"}
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z" />
    </svg>
  )
}

const TaskDisplayBar = ({ task, isSelected, onSelectTask }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [hoverPriority, setHoverPriority] = useState(false)
  const [hoverStatus, setHoverStatus] = useState(false)
  const [priorityAnchorEl, setPriorityAnchorEl] = useState(null)
  const [moreOptionsAnchor, setMoreOptionsAnchor] = useState(null)
  const moreOptionsPaperRef = useRef(null)

  useClickOutsideMoreOptionsPopper(
    moreOptionsAnchor,
    moreOptionsPaperRef,
    setMoreOptionsAnchor,
    openDeleteDialog
  )

  const {
    deleteSingleTask,
    isLoading: isDeletingTask,
    isSuccess: isDeletedTask,
    reset: resetDeleteTask
  } = useDeleteTask()

  const {
    updateSingleTask,
    isSuccess: isUpdatedTask,
    reset: resetUpdateTask
  } = useUpdateTask()

  const handleOpenPriorityMenu = (event) => {
    setPriorityAnchorEl(event.currentTarget)
  }

  const handleClosePriorityMenu = () => {
    setPriorityAnchorEl(null)
  }

  const handleSelectPriority = (value) => {
    setPriorityAnchorEl(null)
    const updatedTaskData = { priority: value }
    updateSingleTask({ id: task._id, updatedTaskData })
  }

  const handleMarkTaskDone = () => {
    const updatedTaskData = { status: 1 }
    updateSingleTask({ id: task._id, updatedTaskData })
  }

  const handleMarkTaskIncomplete = () => {
    const updatedTaskData = { status: 0 }
    updateSingleTask({ id: task._id, updatedTaskData })
  }

  const handleDeleteTask = () => {
    deleteSingleTask({ id: task._id })
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

  const handleOpenEditTask = () => {
    const currentPath = location.pathname
    navigate(`${currentPath}/${task._id}/edit`)
  }

  useEffect(() => {
    if (isDeletedTask) {
      resetDeleteTask()
      setOpenDeleteDialog(false)
    }
  }, [isDeletedTask])

  useEffect(() => {
    if (isUpdatedTask) {
      resetUpdateTask()
    }
  }, [isUpdatedTask])

  return (
    <Box
      onClick={() => {
        if (Boolean(moreOptionsAnchor) || priorityAnchorEl) return
        navigate(`/tasks/${task._id}`)
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFF",
        padding: 1,
        borderRadius: "4px",
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit"
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center"
        }}
      >
        {isSelected ? (
          <CheckBoxRoundedIcon
            sx={{ color: "primary.main", fontSize: "1.3rem" }}
            onClick={(e) => {
              e.stopPropagation()
              onSelectTask(task._id)
            }}
          />
        ) : (
          <CheckBoxOutlineBlankRoundedIcon
            sx={{ color: grey[400], fontSize: "1.3rem" }}
            onClick={(e) => {
              e.stopPropagation()
              onSelectTask(task._id)
            }}
          />
        )}
        <Typography
          sx={{
            fontSize: "0.85rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px"
          }}
        >
          {task.name}
        </Typography>
      </Box>

      <Box>
        <Typography></Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center"
        }}
      >
        {task.status ? (
          <Tooltip arrow title="Mark incomplete" open={hoverStatus}>
            <IconButton
              sx={{ padding: "4px" }}
              onClick={(e) => {
                e.stopPropagation()
                handleMarkTaskIncomplete()
              }}
              onMouseEnter={() => setHoverStatus(true)}
              onMouseLeave={() => setHoverStatus(false)}
            >
              <CheckCircleRoundedIcon
                sx={{ color: "#6CBA87", fontSize: "1rem" }}
              />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip arrow title="Mark done" open={hoverStatus}>
            <IconButton
              sx={{ padding: "4px" }}
              onClick={(e) => {
                e.stopPropagation()
                handleMarkTaskDone()
              }}
              onMouseEnter={() => setHoverStatus(true)}
              onMouseLeave={() => setHoverStatus(false)}
            >
              <CheckCircleOutlineRoundedIcon
                sx={{ color: grey[400], fontSize: "1rem" }}
              />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip arrow title="Priority" open={hoverPriority}>
          <IconButton
            sx={{ padding: "4px" }}
            onMouseEnter={() => setHoverPriority(true)}
            onMouseLeave={() => setHoverPriority(false)}
            onClick={(e) => {
              e.stopPropagation()
              handleOpenPriorityMenu(e)
            }}
          >
            <PriorityIcon
              width="1rem"
              height="1rem"
              color={iconAndTextColorMapping[task.priority]}
            />
          </IconButton>
        </Tooltip>
        <CustomMenu
          options={priorityOptions}
          selectedOption={task.priority}
          openMenu={Boolean(priorityAnchorEl)}
          anchorEl={priorityAnchorEl}
          onCloseMenu={handleClosePriorityMenu}
          onSelectOption={handleSelectPriority}
        />

        <MoreOptionsButton
          openMoreOptions={Boolean(moreOptionsAnchor)}
          onOpenMoreOptions={handleOpenMoreOptions}
        />
        <MoreOptionsMenu
          taskStatus={task.status}
          onMarkTaskDone={() => {
            setMoreOptionsAnchor(null)
            handleMarkTaskDone()
          }}
          onMarkTaskIncomplete={() => {
            setMoreOptionsAnchor(null)
            handleMarkTaskIncomplete()
          }}
          onOpenEditTask={handleOpenEditTask}
          openMoreOptions={Boolean(moreOptionsAnchor)}
          moreOptionsAnchor={moreOptionsAnchor}
          moreOptionsPaperRef={moreOptionsPaperRef}
          openDeleteDialog={openDeleteDialog}
          onOpenDeleteDialog={handleOpenDeleteDialog}
          onCloseDeleteDialog={handleCloseDeleteDialog}
          deleteName={task.name}
          isDeleting={isDeletingTask}
          isDeleted={isDeletedTask}
          onDeleteTask={handleDeleteTask}
        />
      </Box>
    </Box>
  )
}

export default function TaskList({
  tasks,
  totalPages,
  searchInput,
  limit,
  page,
  limitAnchorEl,
  openLimitMenu,
  onLimitChange,
  onPageChange,
  onOpenLimitMenu,
  onCloseLimitMenu
}) {
  const [selectedTasks, setSelectedTasks] = useState([])
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [priorityAnchorEl, setPriorityAnchorEl] = useState(null)
  const imgRef = useRef(null)
  const [imgHeight, setImgHeight] = useState(0)

  const {
    updateMultipleTasks,
    isSuccess: isUpdatedMultipleTasks,
    reset: resetUpdateMultipleTasks
  } = useUpdateMultipleTasks()

  const {
    deleteMultipleTasks,
    isLoading: isDeletingMultipleTasks,
    isSuccess: isDeletedMultipleTasks,
    reset: resetDeleteMultipleTasks
  } = useDeleteMultipleTasks()

  const handleSelectTask = (taskId) => {
    setSelectedTasks((prev) => {
      if (!prev.includes(taskId)) return [...prev, taskId]
      return prev.filter((id) => id !== taskId)
    })
  }

  const handleDeleteMultipleTasks = () => {
    setOpenDeleteDialog(false)
    setSelectedTasks([])
    deleteMultipleTasks(selectedTasks)
  }

  const handleUpdateMultipleTasks = (selectedPriority) => {
    setPriorityAnchorEl(null)
    updateMultipleTasks({
      ids: selectedTasks,
      updatedTaskData: { priority: selectedPriority }
    })
  }

  const handleOpenPriorityMenu = (event) => {
    setPriorityAnchorEl(event.currentTarget)
  }

  const handleClosePriorityMenu = () => {
    setPriorityAnchorEl(null)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true)
  }

  useEffect(() => {
    if (isDeletedMultipleTasks) {
      resetDeleteMultipleTasks()
      setOpenDeleteDialog(false)
    }
  }, [isDeletedMultipleTasks])

  useEffect(() => {
    if (isUpdatedMultipleTasks) {
      resetUpdateMultipleTasks()
    }
  }, [isUpdatedMultipleTasks])

  useHeightObserver(imgRef, setImgHeight)

  if (!tasks)
    return (
      <Box
        sx={{
          height: {
            xs: "calc(100% - 136.9px)",
            sm: "calc(100% - 84.5px)"
          },
          backgroundColor: "#FFF",
          padding: 2,
          borderRadius: "8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 400
          }}
        >
          <Box
            ref={imgRef}
            component="img"
            src={taskNotFoundImage}
            alt="Tasks not found!"
            sx={{
              width: "100%",
              height: "auto"
            }}
          />
          <Typography
            sx={{
              fontWeight: 600,
              position: "absolute",
              textAlign: "center",
              top: `${0.85 * imgHeight}px`,
              fontSize: { xs: "1.4rem", sm: "1.6rem" },
              width: "100%"
            }}
          >
            Tasks not found
          </Typography>
        </Box>
      </Box>
    )

  return (
    <Box
      sx={{
        height: {
          xs: "calc(100% - 160.9px)",
          sm: "calc(100% - 108.5px)"
        }
      }}
    >
      <Collapse in={selectedTasks.length > 0} timeout={350}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginBottom: 1
          }}
        >
          <Button
            startIcon={<PriorityIcon width="1rem" height="1rem" />}
            sx={{
              px: 1.2,
              borderRadius: "8px",
              textTransform: "none",
              color: "primary.main"
            }}
            onClick={handleOpenPriorityMenu}
          >
            Priority
          </Button>
          <CustomMenu
            options={priorityOptions}
            selectedOption={null}
            openMenu={Boolean(priorityAnchorEl)}
            anchorEl={priorityAnchorEl}
            onCloseMenu={handleClosePriorityMenu}
            onSelectOption={handleUpdateMultipleTasks}
          />

          <Button
            startIcon={<DeleteOutlineRoundedIcon sx={{ fontSize: "1rem" }} />}
            sx={{
              px: 1.2,
              borderRadius: "8px",
              textTransform: "none",
              color: "primary.main"
            }}
            onClick={handleOpenDeleteDialog}
          >
            Delete
          </Button>
          {openDeleteDialog && (
            <CustomDeleteDialog
              openDeleteDialog={openDeleteDialog}
              onCloseDeleteDialog={handleCloseDeleteDialog}
              name="these tasks"
              isDeleting={isDeletingMultipleTasks}
              isDeleted={isDeletedMultipleTasks}
              onDelete={handleDeleteMultipleTasks}
            />
          )}
        </Box>
      </Collapse>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          height:
            selectedTasks.length > 0
              ? "calc(100% - 81px)"
              : "calc(100% - 36.5px)",
          overflowY: "auto"
        }}
      >
        {tasks
          .filter((task) =>
            task.name.toLowerCase().includes(searchInput.trim().toLowerCase())
          )
          .map((task, index) => (
            <TaskDisplayBar
              key={index}
              task={task}
              isSelected={selectedTasks.includes(task._id)}
              onSelectTask={handleSelectTask}
            />
          ))}
      </Box>

      <PaginationBar
        limit={limit}
        page={page}
        totalPages={totalPages}
        openLimitMenu={openLimitMenu}
        limitAnchorEl={limitAnchorEl.current}
        onLimitChange={onLimitChange}
        onPageChange={onPageChange}
        onOpenLimitMenu={onOpenLimitMenu}
        onCloseLimitMenu={onCloseLimitMenu}
      />
    </Box>
  )
}
