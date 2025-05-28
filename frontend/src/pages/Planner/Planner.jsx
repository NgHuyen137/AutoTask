import { useRef, useEffect } from "react"
import { useLayoutContext, usePlannerContext, useAuthContext } from "~/hooks/useContext"
import { useFetchUser } from "~/hooks/useQuery"
import { useDelayRedirect } from "~/hooks/useEffect"

import Spinner from "~/components/ui/Spinner"

import Calendar from "./Calendar/Calendar"
import AppBar from "~/components/AppBar/AppBar"
import SideBar from "~/components/SideBar/SideBar"
import TaskCreatePopup from "./TaskCreatePopup/TaskCreatePopup"
import TaskManageSidebar from "./TaskManageSidebar/TaskManageSidebar"
import MainContainer from "~/components/MainContainer/MainContainer"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

export default function Planner() {
  const { setUser } = useAuthContext()
  const { isLoggingOut, logoutSuccess, isLoggedOut, setIsLoggedOut } = useLayoutContext()
  const { openTaskSidebar, taskSidebarWidth } = usePlannerContext()
  const menuButtonRef = useRef(null)
  const taskSidebarRef = useRef(null)
  const popperRef = useRef(null)
  const anchorEl = useRef(null)
  const taskCreateFormRef = useRef(null)
  const calendarRef = useRef(null)

  const { currentUser, isSuccess } = useFetchUser()
  useEffect(() => {
    if (isSuccess) {
      setUser(currentUser)
      setIsLoggedOut(false)
    }
  }, [isSuccess])

  useDelayRedirect(logoutSuccess, setIsLoggedOut)

  if (isLoggingOut || (logoutSuccess && !isLoggedOut))
    return (
      <Spinner />
    )

  if (isLoggedOut)
    return <Navigate to="/login" replace={true} />

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
