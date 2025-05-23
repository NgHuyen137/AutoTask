import { useRef } from "react"
import { Navigate } from "react-router"
import { useAuthContext, usePlannerContext } from "~/hooks/useContext"
import Calendar from "./Calendar/Calendar"
import AppBar from "~/components/AppBar/AppBar"
import SideBar from "~/components/SideBar/SideBar"
import TaskCreatePopup from "./TaskCreatePopup/TaskCreatePopup"
import TaskManageSidebar from "./TaskManageSidebar/TaskManageSidebar"
import MainContainer from "~/components/MainContainer/MainContainer"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

export default function Planner() {
  const { accessToken } = useAuthContext()
  const { openTaskSidebar, taskSidebarWidth } = usePlannerContext()
  const menuButtonRef = useRef(null)
  const taskSidebarRef = useRef(null)
  const popperRef = useRef(null)
  const anchorEl = useRef(null)
  const taskCreateFormRef = useRef(null)
  const calendarRef = useRef(null)

  if (!accessToken) 
    setTimeout(() => {return}, 10000)

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: "100vh", display: "flex", overflow: "hidden" }}
    >
      <SideBar menuButtonRef={menuButtonRef} />
      <MainContainer>
        <AppBar
          menuButtonRef={menuButtonRef}
          taskCreateFormRef={taskCreateFormRef}
        />
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
      </MainContainer>
    </Container>
  )
}
