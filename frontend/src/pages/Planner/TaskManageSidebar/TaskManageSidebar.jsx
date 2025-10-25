import { useEffect, useState, useRef } from "react"
import { usePlannerContext, useLayoutContext } from "~/hooks/useContext"
import { useUpdateTask, useDeleteTask } from "~/hooks/useMutation"
import { useScreenSize } from "~/hooks/useEffect"
import { useClickOutsideMoreOptionsPopper } from "~/hooks/useEffect"
import EditButton from "~/components/ui/EditButton"
import TaskDetails from "~/components/TaskDetails/TaskDetails"
import TaskUpdate from "./TaskUpdate/TaskUpdate"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import MoreOptionsButton from "~/components/ui/MoreOptionsButton"
import MoreOptionsMenu from "~/components/ui/MoreOptionsMenu"

const useResponsiveTaskSidebarWidth = (
  screenWidth,
  minTaskSidebarWidth,
  maxTaskSidebarWidth,
  taskSidebarWidth,
  setTaskSidebarWidth,
  fullWidthThreshold
) => {
  // Limit Task Sidebar's width based on screen size
  useEffect(() => {
    const newTaskSidebarWidth =
      screenWidth < fullWidthThreshold
        ? screenWidth
        : Math.min(
            Math.max(taskSidebarWidth, minTaskSidebarWidth),
            maxTaskSidebarWidth
          )

    setTaskSidebarWidth(newTaskSidebarWidth)
    localStorage.setItem("taskSidebarWidth", newTaskSidebarWidth)
  }, [screenWidth])
}

export default function TaskManageSidebar({ taskSidebarRef }) {
  const { openSidebar } = useLayoutContext()
  const {
    openTaskSidebar,
    setOpenTaskSidebar,
    taskSidebarWidth,
    setTaskSidebarWidth,
    targetTask,
    setTargetTask,
    openUpdate,
    setOpenUpdate
  } = usePlannerContext()

  const { updateSingleTask } = useUpdateTask()
  const {
    deleteSingleTask,
    isLoading: isDeletingTask,
    isSuccess: isDeletedTask,
    reset: resetDeleteTask
  } = useDeleteTask()

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [moreOptionsAnchor, setMoreOptionsAnchor] = useState(null)
  const moreOptionsPaperRef = useRef(null)

  const screenWidth = useScreenSize()
  const fullWidthThreshold = 600 // Task Sidebar's width is 100% screen's size when screen's size < 500

  const defaultTaskSidebarWidth = 480
  const minTaskSidebarWidth = 400
  const maxTaskSidebarWidth = screenWidth * 0.7

  useResponsiveTaskSidebarWidth(
    screenWidth,
    minTaskSidebarWidth,
    maxTaskSidebarWidth,
    taskSidebarWidth,
    setTaskSidebarWidth,
    fullWidthThreshold
  )

  useClickOutsideMoreOptionsPopper(
    moreOptionsAnchor,
    moreOptionsPaperRef,
    setMoreOptionsAnchor,
    openDeleteDialog
  )

  const handleMarkTaskDone = () => {
    const updatedTaskData = { status: 1 }
    updateSingleTask({ id: targetTask.id, updatedTaskData })

    // Close Update page
    setOpenUpdate(false)
    localStorage.setItem("openUpdate", false)
    setOpenTaskSidebar(false)
    localStorage.setItem("openTaskSidebar", false)
    setTaskSidebarWidth(defaultTaskSidebarWidth)
    localStorage.setItem("taskSidebarWidth", defaultTaskSidebarWidth)
    setTargetTask(null)
    localStorage.setItem("targetTask", null)
  }

  const handleMarkTaskIncomplete = () => {
    const updatedTaskData = { status: 0 }
    updateSingleTask({ id: targetTask.id, updatedTaskData })

    // Close Update page
    setOpenUpdate(false)
    localStorage.setItem("openUpdate", false)
    setOpenTaskSidebar(false)
    localStorage.setItem("openTaskSidebar", false)
    setTaskSidebarWidth(defaultTaskSidebarWidth)
    localStorage.setItem("taskSidebarWidth", defaultTaskSidebarWidth)
    setTargetTask(null)
    localStorage.setItem("targetTask", null)
  }

  const handleDeleteTask = () => {
    setOpenDeleteDialog(false)
    setOpenUpdate(false)
    localStorage.setItem("openUpdate", false)
    setOpenTaskSidebar(false)
    localStorage.setItem("openTaskSidebar", false)
    setTaskSidebarWidth(defaultTaskSidebarWidth)
    localStorage.setItem("taskSidebarWidth", defaultTaskSidebarWidth)
    setTargetTask(null)
    localStorage.setItem("targetTask", null)

    setTimeout(() => {
      deleteSingleTask({ id: targetTask.id })
      resetDeleteTask()
    }, 1000)
  }

  const handleOpenEditTask = () => {
    setOpenUpdate(true)
    localStorage.setItem("openUpdate", true)
  }

  const handleOpenMoreOptions = (event) => {
    setMoreOptionsAnchor(event.currentTarget)
  }

  const handleResizeTaskSidebar = (e) => {
    e.preventDefault() // Prevent text selection and other default behaviors
    document.body.style.cursor = "col-resize"

    const handleMouseMove = (e) => {
      const newWidth = window.innerWidth - e.clientX
      // Ensure Sidebar width is between minimum and maximum width
      const sidebarWidth = Math.min(
        Math.max(newWidth, minTaskSidebarWidth),
        maxTaskSidebarWidth
      )

      setTaskSidebarWidth(sidebarWidth)
      localStorage.setItem("taskSidebarWidth", sidebarWidth)
    }

    const handleMouseUp = () => {
      document.body.style.cursor = "default"
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  const handleOpenDeleteDialog = () => {
    setMoreOptionsAnchor(null)
    setOpenDeleteDialog(true)
  }

  if (!openTaskSidebar) return

  return (
    <Drawer
      disablePortal
      hideBackdrop
      variant="persistent"
      anchor="right"
      open={openTaskSidebar}
      PaperProps={{
        "aria-hidden": openSidebar ? true : undefined,
        ref: taskSidebarRef,
        elevation: 0,
        sx: {
          flexDirection: "row",
          width: {
            xs: "100%",
            sm: `${taskSidebarWidth}px`
          },
          height: "calc(100vh - 56px)",
          marginTop: "56px",
          paddingTop: 1,
          paddingBottom: "16px",
          borderLeft: "2px solid #E5E6E9",
          backgroundColor: "#F7F8FC",
          zIndex: openSidebar ? 1000 : 1200
        }
      }}
    >
      {/* Make dragger */}
      <Box
        onMouseDown={handleResizeTaskSidebar}
        sx={{
          width: "5px",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          cursor: "col-resize"
        }}
      />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          overflowY: "auto",
          overflowX: "hidden"
        }}
      >
        {!openUpdate ? (
          <Box
            sx={{
              height: "48px",
              paddingRight: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end"
            }}
          >
            <EditButton onEdit={handleOpenEditTask} />

            <MoreOptionsButton
              openMoreOptions={Boolean(moreOptionsAnchor)}
              onOpenMoreOptions={handleOpenMoreOptions}
            />
            <MoreOptionsMenu
              taskStatus={targetTask.status}
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
              deleteName={targetTask.name}
              isDeleting={isDeletingTask}
              isDeleted={isDeletedTask}
              onDeleteTask={handleDeleteTask}
            />

            <Tooltip arrow title="Close">
              <IconButton
                sx={{ padding: "4px" }}
                onClick={() => {
                  setOpenTaskSidebar(false)
                  setTaskSidebarWidth(defaultTaskSidebarWidth)
                  localStorage.setItem("openTaskSidebar", false)
                  localStorage.setItem(
                    "taskSidebarWidth",
                    defaultTaskSidebarWidth
                  )
                  localStorage.setItem("targetTask", null)
                  setTargetTask(null)
                }}
              >
                <CloseOutlinedIcon
                  sx={{ fontSize: "1.25rem", color: "primary.dark" }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Box
            sx={{
              height: "48px",
              padding: "8px 16px 8px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end"
            }}
          >
            <IconButton
              sx={{ padding: "4px" }}
              onClick={() => {
                setOpenUpdate(false)
                localStorage.setItem("openUpdate", false)
              }}
            >
              <CloseOutlinedIcon
                sx={{ fontSize: "1.25rem", color: "primary.dark" }}
              />
            </IconButton>
          </Box>
        )}

        {openUpdate ? (
          <TaskUpdate taskSidebarRef={taskSidebarRef} />
        ) : (
          <TaskDetails taskSidebarRef={taskSidebarRef} />
        )}
      </Box>
    </Drawer>
  )
}
