import { NavLink } from "react-router-dom"
import { useMediaQuery } from "@mui/material"
import { useRef, useEffect } from "react"
import { useAuthContext, useLayoutContext, usePlannerContext } from "~/hooks/useContext"
import { useScreenSize } from "~/hooks/useEffect"
import { useLogout } from "~/hooks/useMutation"

import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import SvgIcon from "@mui/material/SvgIcon"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined"
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined"
import DonutLargeOutlinedIcon from "@mui/icons-material/DonutLargeOutlined"
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined"
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded"
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded"

const sideBarItems = [
  { Name: "Planner", Icon: CalendarTodayOutlinedIcon, path: "/planner" },
  { Name: "Tasks", Icon: AssignmentTurnedInOutlinedIcon, path: "/tasks" },
  { Name: "Analytics", Icon: DonutLargeOutlinedIcon, path: "/analytics" },
  { Name: "Scheduling Hours", Icon: ScheduleOutlinedIcon, path: "/scheduling-hours" }
]

const useSidebarMounted = () => {
  // Track when Drawer is opened
  const sidebarScreenSizeThreshold = 800
  const screenWidth = useScreenSize()
  const { setSidebarMounted } = useLayoutContext()

  useEffect(() => {
    if (screenWidth > sidebarScreenSizeThreshold)
      setTimeout(() => setSidebarMounted(true), 100)
    else setSidebarMounted(false)
  }, [screenWidth])
}

export default function SideBar() {
  const isMobile = useMediaQuery("(max-width: 499px)")
  const sidebarScreenSizeThreshold = 800 // Move Sidebar to the top right when screen size changes
  const screenWidth = useScreenSize()

  const { showTaskCreatePopup } = usePlannerContext()
  const { 
    user, 
    setUser, 
    setAccessToken,
    setIsLoggingOut,
    setLogoutSuccess
  } = useAuthContext()

  const {
    openSidebar,
    setOpenSidebar,
    lockSidebar,
    setLockSidebar,
    hoverPin,
    setHoverPin
  } = useLayoutContext()

  const sidebarPaperRef = useRef(null)

  useSidebarMounted()

  const handleSidebarOpen = () => {
    if (
      (!openSidebar && showTaskCreatePopup) ||
      screenWidth <= sidebarScreenSizeThreshold
    )
      // Only allow Sidebar to open when the TaskCreatePopup is closed
      return
    setOpenSidebar(true)
    localStorage.setItem("openSidebar", true)
  }

  const handleSidebarClose = () => {
    if (screenWidth <= sidebarScreenSizeThreshold) return

    if (!lockSidebar) {
      setOpenSidebar(false)
      localStorage.setItem("openSidebar", false)
    }
  }

  const { logout, isLoading, isSuccess } = useLogout()
  const handleLogout = () => {
    logout({
      onSuccess: () => {
        setAccessToken(null)
        setUser(null)
      }
    })
  }

  useEffect(() => {
    setIsLoggingOut(isLoading)
    setLogoutSuccess(isSuccess)
  }, [isLoading, isSuccess])

  return (
    <Drawer
      inert={
        screenWidth <= sidebarScreenSizeThreshold
          ? openSidebar
            ? undefined
            : true
          : undefined
      }
      open={
        screenWidth > sidebarScreenSizeThreshold
          ? true
          : openSidebar
          ? true
          : false
      }
      disablePortal
      hideBackdrop={screenWidth > sidebarScreenSizeThreshold ? true : false}
      variant={
        screenWidth > sidebarScreenSizeThreshold ? "persistent" : "temporary"
      }
      transitionDuration={screenWidth > sidebarScreenSizeThreshold ? 0 : "auto"}
      onClose={() => setOpenSidebar(false)}
      PaperProps={{
        ref: sidebarPaperRef,
        sx: (theme) => ({
          width:
            openSidebar || lockSidebar
              ? theme.sideBar.width.open
              : screenWidth > sidebarScreenSizeThreshold
              ? theme.sideBar.width.close
              : 0,
          transition: `${theme.transitions.create("width", {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard
          })} !important`,
          backgroundColor: "primary.dark",
          borderRight: "none",
          overflow: "hidden",
          transform: "none !important"
        })
      }}
    >
      <Box
        onMouseEnter={handleSidebarOpen}
        onMouseLeave={handleSidebarClose}
        role="presentation"
        sx={{ height: "100%" }}
      >
        <List 
          sx={{ 
            height: "100%",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <ListItem
            sx={{
              justifyContent: "flex-end",
              padding: "8px 8px 0 0",
              minHeight: "24px",
              visibility:
                screenWidth > sidebarScreenSizeThreshold ? "visible" : "hidden"
            }}
          >
            <ListItemIcon
              sx={{ justifyContent: "flex-end", paddingRight: "8px" }}
            >
              {(openSidebar || lockSidebar) && (
                <SvgIcon
                  onMouseEnter={() => {
                    setHoverPin(true)
                    localStorage.setItem("hoverPin", true)
                  }}
                  onMouseLeave={() => {
                    if (!lockSidebar) {
                      setHoverPin(false)
                      localStorage.setItem("hoverPin", false)
                    }
                  }}
                  onClick={() => {
                    const newLockSidebar = !lockSidebar
                    setLockSidebar(newLockSidebar)
                    localStorage.setItem("lockSidebar", newLockSidebar)
                  }}
                  sx={{
                    cursor: "pointer",
                    width: "1rem",
                    height: "1rem"
                  }}
                >
                  {!hoverPin ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-pin-angle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146m.122 2.112v-.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a5 5 0 0 0-.288-.076 5 5 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a5 5 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034q.172.002.343-.04L9.927 2.028q-.042.172-.04.343a1.8 1.8 0 0 0 .062.46z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-pin-angle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146" />
                    </svg>
                  )}
                </SvgIcon>
              )}
            </ListItemIcon>
          </ListItem>

          <Box
            sx={{
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: 1
            }}
          >
            {sideBarItems.map(({ Name, Icon, path }) => (
              <ListItem key={Name} sx={{ padding: 0 }}>
                <NavLink
                  to={path}
                  style={({ isActive }) => ({
                    textDecoration: "none",
                    width: "100%",
                    display: "block"
                  })}
                >
                  {({ isActive }) => (
                    <ListItemButton
                      sx={{
                        backgroundColor: isActive ? "#e2eafc" : "primary.dark",
                        "& .MuiListItemIcon-root, & .MuiListItemText-root": {
                          color: isActive ? "primary.dark" : "#FFFFFF"
                        },
                        "&:hover": {
                          backgroundColor: (theme) =>
                            theme.sideBar.colorSchemes.hover.background,
                          "& .MuiListItemIcon-root, & .MuiListItemText-root": {
                            color: (theme) =>
                              theme.sideBar.colorSchemes.hover.content
                          }
                        },
                        padding: "4px 8px"
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: "40px",
                          paddingLeft: "2px"
                        }}
                      >
                        <Icon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        sx={{
                          visibility:
                            openSidebar || lockSidebar ? "visible" : "hidden",
                          whiteSpace: "nowrap",
                          marginTop: "8px",
                          "& .MuiTypography-root": {
                            fontWeight: 500
                          }
                        }}
                        primary={Name}
                      />
                    </ListItemButton>
                  )}
                </NavLink>
              </ListItem>
            ))}
          </Box>

          {
            isMobile &&
            (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  flex: 1,
                  gap: 1,
                  padding: 1
                }}
              >
                <Divider sx={{ backgroundColor: "#ccdbfd" }} />
                <ListItem sx={{ padding: 0 }}>
                  <ListItemButton>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px"
                      }}
                    >
                      <PermIdentityRoundedIcon 
                        sx={{ fontSize: "1.25rem", color: "#FFF" }} 
                      />
                      <Box>
                        <Typography 
                          sx={{ 
                            fontSize: "0.9rem",
                            color: "#FFFFFF", 
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "160px"
                          }}
                        >
                          {user ? user["name"] : " "}
                        </Typography>
                        <Typography 
                          sx={{ 
                            color: "#FFFFFF",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "160px"
                          }}
                        >
                          {user ? user["email"] : " "}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItemButton>
                </ListItem>

                <Divider sx={{ backgroundColor: "#ccdbfd" }} />
                
                <ListItem sx={{ padding: 0 }}>
                  <ListItemButton
                    onClick={handleLogout}
                  >
                    <ListItemIcon sx={{ minWidth: "40px" }}>
                      <LogoutRoundedIcon sx={{ fontSize: "1.25rem", color: "#FFF" }} />
                    </ListItemIcon>
                    <Typography sx={{ color: "#FFFFFF", fontSize: "0.9rem", fontWeight: 500 }}>
                      Log out
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </Box>
            )
          }
        </List>
      </Box>
    </Drawer>
  )
}
