import { useRef } from "react"
import { useLayoutContext, usePlannerContext } from "~/hooks/useContext"
import { useMediaQuery } from "@mui/material"
import { useScreenSize } from "~/hooks/useEffect"

import UserAccount from "./UserAccount/UserAccount"

import TaskCreateButton from "./TaskCreateButton/TaskCreateButton"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import { AppBar as MuiAppBar } from "@mui/material"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import MenuRoundedIcon from "@mui/icons-material/MenuRounded"

export default function AppBar({ menuButtonRef, taskCreateFormRef }) {
  const isMobile = useMediaQuery("(max-width: 499px)")

  const screenWidth = useScreenSize()
  const sidebarScreenSizeThreshold = 800

  const buttonRef = useRef(null)
  const { setEnterTaskCreateForm, showTaskCreateForm, setShowTaskCreateForm } =
    usePlannerContext()

  const { setOpenSidebar } = useLayoutContext()

  return (
    <Box>
      <MuiAppBar
        position="static"
        elevation={0}
        sx={{
          height: "56px",
          backgroundColor: "background.default",
          boxShadow: "none",
          borderBottom: "1px solid #e5e6e9"
        }}
      >
        <Toolbar
          sx={{
            paddingBottom: "8px",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Typography
            variant="h1"
            component="div"
            color="text.primary"
            fontWeight={500}
          >
            Planner
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >
            {!isMobile ? (
              <Button
                ref={buttonRef}
                variant="text"
                size="small"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  if (showTaskCreateForm) setEnterTaskCreateForm(false)
                  else {
                    setEnterTaskCreateForm(true)
                    setShowTaskCreateForm(true)
                  }
                }}
                sx={{
                  textTransform: "none",
                  fontSize: "0.8rem",
                  fontWeight: 510,
                  color: "text.primary",
                  backgroundColor: "background.default",
                  padding: "6px 8px",
                  borderRadius: "16px",
                  "& .MuiButton-startIcon": {
                    marginRight: "4px"
                  },
                  "&:hover": {
                    backgroundColor: "#eeeff3"
                  }
                }}
              >
                New Task
              </Button>
            ) : (
              <IconButton
                ref={buttonRef}
                onClick={() => {
                  if (showTaskCreateForm) setEnterTaskCreateForm(false)
                  else {
                    setEnterTaskCreateForm(true)
                    setShowTaskCreateForm(true)
                  }
                }}
                sx={{ padding: 1 }}
              >
                <AddRoundedIcon
                  sx={{ color: "text.primary", fontSize: "1.25rem" }}
                />
              </IconButton>
            )}

            <TaskCreateButton
              buttonRef={buttonRef}
              taskCreateFormRef={taskCreateFormRef}
            />

            {
              !isMobile &&
              <UserAccount />
            }

            {screenWidth <= sidebarScreenSizeThreshold && (
              <IconButton
                ref={menuButtonRef}
                onClick={() => {
                  document.activeElement?.blur()
                  setTimeout(() => setOpenSidebar(true), 0)
                }}
              >
                <MenuRoundedIcon sx={{ color: "text.primary" }} />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </MuiAppBar>
    </Box>
  )
}
