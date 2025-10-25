import { useRef } from "react"
import { Outlet, useLocation } from "react-router-dom"

import AppBar from "~/components/AppBar/AppBar"
import SideBar from "~/components/SideBar/SideBar"
import MainContainer from "~/components/MainContainer/MainContainer"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

export default function MainLayout() {
  const menuButtonRef = useRef(null)
  const taskCreateFormRef = useRef(null)

  const location = useLocation()
  const getAppBarName = () => {
    if (location.pathname.startsWith("/planner")) return "Planner"
    if (location.pathname.startsWith("/tasks")) return "Tasks"
    if (location.pathname.startsWith("/scheduling-hours")) return "Hours"
    if (location.pathname.startsWith("/analytics")) return "Analytics"
    return "Unknown"
  }

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: "100vh", display: "flex", overflow: "hidden" }}
    >
      <SideBar />
      <MainContainer>
        <AppBar
          appBarName={getAppBarName()}
          menuButtonRef={menuButtonRef}
          taskCreateFormRef={taskCreateFormRef}
        />
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <Outlet />
        </Box>
      </MainContainer>
    </Container>
  )
}
