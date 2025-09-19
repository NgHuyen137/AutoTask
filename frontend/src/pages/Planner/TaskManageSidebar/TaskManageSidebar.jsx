import { useEffect, useState, useRef } from "react"
import { usePlannerContext, useLayoutContext } from "~/hooks/useContext"
import { useUpdateTask, useDeleteTask } from "~/hooks/useMutation"
import { useScreenSize } from "~/hooks/useEffect"
import { useClickOutsideMoreOptionsPopper } from "~/hooks/useEffect"
import EditButton from "~/components/ui/EditButton"
import TaskDetails from "~/components/TaskDetails/TaskDetails"
import TaskUpdate from "./TaskUpdate/TaskUpdate"
import Box from "@mui/material/Box"
import Popper from "@mui/material/Popper"
import Grow from "@mui/material/Grow"
import Paper from "@mui/material/Paper"
import Drawer from "@mui/material/Drawer"
import Tooltip from "@mui/material/Tooltip"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import SvgIcon from "@mui/material/SvgIcon"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined"
import CustomDeleteDialog from "~/components/ui/CustomDeleteDialog"
import MoreOptionsButton from "~/components/ui/MoreOptionsButton"

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

  const [hoverMoreOptionsButton, setHoverMoreOptionsButton] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openMoreOptions, setOpenMoreOptions] = useState(false)
  const moreOptionsAnchor = useRef(null)
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
    setOpenMoreOptions,
    openDeleteDialog
  )

  const handleMarkTaskDone = () => {
    const updatedTaskData = {
      name: targetTask.name,
      status: 1,
      priority: targetTask.priority,
      tags: targetTask.tags,
      description: targetTask.description,
      smart_scheduling: targetTask.smartScheduling,
      start_date: targetTask.smartScheduling ? targetTask.startDate : null,
      due_date: targetTask.smartScheduling ? targetTask.dueDate : null,
      scheduling_hour_id: targetTask.smartScheduling
        ? targetTask.schedulingHour
        : null,
      duration: targetTask.smartScheduling ? targetTask.duration : null,
      split: targetTask.smartScheduling ? targetTask.split : null,
      time_allocations: !targetTask.smartScheduling
        ? [
            {
              start_at: targetTask.startAt,
              end_at: targetTask.endAt,
              is_scheduled_ontime: true
            }
          ]
        : null,
      created_at: targetTask.createdAt
    }

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
    moreOptionsAnchor.current = event.currentTarget
    setOpenMoreOptions((prev) => {
      if (prev === false) return true
      return false
    })
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

            <MoreOptionsButton openMoreOptions={openMoreOptions} onOpenMoreOptions={handleOpenMoreOptions} />
            <Popper
              disablePortal
              transition
              placement="left-end"
              open={openMoreOptions}
              anchorEl={moreOptionsAnchor.current}
              sx={{ zIndex: 1600 }}
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps} timeout={350}>
                  <Paper
                    ref={moreOptionsPaperRef}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "12px",
                      boxShadow:
                        "0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.03),0px 3px 14px 2px rgba(0, 0, 0, 0.05)"
                    }}
                  >
                    <List
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        padding: 0
                      }}
                    >
                      <Button
                        onClick={() => {
                          setOpenUpdate(true)
                          localStorage.setItem("openUpdate", true)
                        }}
                        sx={{
                          textTransform: "none",
                          padding: 0,
                          borderRadius: "12px 12px 0 0",
                          color: "text.primary",
                          ":hover": {
                            backgroundColor: "#f5f5f5"
                          }
                        }}
                      >
                        <ListItem sx={{ padding: "2px 16px" }}>
                          <ListItemIcon sx={{ minWidth: "24px" }}>
                            <SvgIcon
                              sx={{ fontSize: "0.9rem", color: "#9e9e9e" }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="1em"
                                height="1em"
                              >
                                <path
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
                                ></path>
                              </svg>
                            </SvgIcon>
                          </ListItemIcon>
                          <ListItemText
                            sx={{
                              "& .MuiTypography-root": { fontSize: "0.8rem" }
                            }}
                          >
                            Edit
                          </ListItemText>
                        </ListItem>
                      </Button>
                      <Button
                        onClick={handleMarkTaskDone}
                        sx={{
                          textTransform: "none",
                          padding: 0,
                          color: "text.primary",
                          ":hover": {
                            backgroundColor: "#f5f5f5"
                          }
                        }}
                      >
                        <ListItem sx={{ padding: "2px 16px" }}>
                          <ListItemIcon sx={{ minWidth: "24px" }}>
                            <CheckCircleOutlineOutlinedIcon
                              sx={{ fontSize: "1rem", color: "#9e9e9e" }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            sx={{
                              "& .MuiTypography-root": { fontSize: "0.8rem" }
                            }}
                          >
                            Mark done
                          </ListItemText>
                        </ListItem>
                      </Button>
                      <Button
                        onClick={() => {
                          setOpenDeleteDialog(true)
                          setOpenMoreOptions(false)
                        }}
                        sx={{
                          textTransform: "none",
                          padding: 0,
                          borderRadius: "0 0 12px 12px",
                          color: "text.primary",
                          ":hover": {
                            backgroundColor: "#f5f5f5"
                          }
                        }}
                      >
                        <ListItem sx={{ padding: "2px 16px" }}>
                          <ListItemIcon sx={{ minWidth: "24px" }}>
                            <DeleteOutlinedIcon
                              sx={{ fontSize: "1rem", color: "#9e9e9e" }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            sx={{
                              "& .MuiTypography-root": { fontSize: "0.8rem" }
                            }}
                          >
                            Delete
                          </ListItemText>
                        </ListItem>
                      </Button>
                    </List>
                  </Paper>
                </Grow>
              )}
            </Popper>
            {openDeleteDialog && (
              <CustomDeleteDialog
                openDeleteDialogState={{
                  openDeleteDialog,
                  setOpenDeleteDialog
                }}
                name={targetTask.name}
                isDeleting={isDeletingTask}
                isDeleted={isDeletedTask}
                onDelete={handleDeleteTask}
              />
            )}

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
