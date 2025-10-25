import { useRef } from "react"
import { Navigate } from "react-router-dom"
import { usePlannerContext, useAuthContext } from "~/hooks/useContext"

import Spinner from "~/components/ui/Spinner"

import Calendar from "./Calendar/Calendar"
import TaskCreatePopup from "./TaskCreatePopup/TaskCreatePopup"
import TaskManageSidebar from "./TaskManageSidebar/TaskManageSidebar"
import Box from "@mui/material/Box"

export default function Planner() {
  const { isLoggingOut, logoutSuccess } = useAuthContext()
  const { openTaskSidebar, taskSidebarWidth } = usePlannerContext()
  const taskSidebarRef = useRef(null)
  const popperRef = useRef(null)
  const anchorEl = useRef(null)
  const calendarRef = useRef(null)

  if (logoutSuccess) return <Navigate to="/login" replace={true} />

  return (
    <Box sx={{ height: "calc(100vh - 56px)" }}>
      <Box
        sx={{
          height: "100%",
          flexGrow: 1,
          marginRight: {
            xs: 0,
            sm: openTaskSidebar ? `${taskSidebarWidth}px` : 0
          }
        }}
      >
        <Calendar
          calendarRef={calendarRef}
          anchorEl={anchorEl}
          popperRef={popperRef}
        />
        <TaskCreatePopup
          popperRef={popperRef}
          anchorEl={anchorEl}
          calendarRef={calendarRef}
        />
      </Box>
      <TaskManageSidebar taskSidebarRef={taskSidebarRef} />
    </Box>
  )
}
