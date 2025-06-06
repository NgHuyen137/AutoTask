import { useState, useEffect, useRef } from "react"
import { useAuthContext, useLayoutContext } from "~/hooks/useContext"
import { useLogout } from "~/hooks/useMutation"

import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Divider from "@mui/material/Divider"
import Button from "@mui/material/Button"
import Avatar from "@mui/material/Avatar"
import Popper from "@mui/material/Popper"
import Grow from "@mui/material/Grow"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"

const getUserDetails = (user, setName, setEmail, setPicture) => {
  useEffect(() => {
    if (user) {
      setName(user["name"])
      setEmail(user["email"])
      setPicture(user["picture"] || "")
    }
  }, [user])
}

const clickOutside = (accountAnchorEl, setOpenAccountMenu) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountAnchorEl && !accountAnchorEl.contains(event.target)) {
        setOpenAccountMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [accountAnchorEl])
}

export default function UserAccount() {
  const [openAccountMenu, setOpenAccountMenu] = useState(false)
  const [accountAnchorEl, setAccountAnchorEl] = useState(null)
  const { user, setUser, setAccessToken } = useAuthContext()
  const { setIsLoggingOut, setLogoutSuccess } = useLayoutContext()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [picture, setPicture] = useState("")
  const accountMenuRef = useRef(null)


  clickOutside(accountAnchorEl, setOpenAccountMenu)
  getUserDetails(user, setName, setEmail, setPicture)
  
  const handleAccountMenuClick = (event) => {
    setAccountAnchorEl(event.currentTarget)
    setOpenAccountMenu((prev) => !prev)
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
    <>
      <Button
        disabled={openAccountMenu ? true : false}
        onClick={handleAccountMenuClick}
        sx={{
          borderRadius: 4
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.4
          }}
        >
          {
            picture && 
            (
              <Avatar
                src={picture}
                sx={{
                  width: "24px",
                  height: "24px"
                }}
              />
            )
          }

          {
            !picture &&
            (
              <Avatar
                sx={{
                  backgroundColor: "#78909C",
                  width: "24px",
                  height: "24px",
                  fontSize: "0.8rem"
                }}
              >
                {name ? name[0].toUpperCase() : " "}
              </Avatar>
            )
          }

          <KeyboardArrowDownRoundedIcon 
            sx={{ 
              fontSize: "1.2rem", 
              color: "black" 
            }} 
          />
        </Box>
      </Button>
      <Popper 
        open={openAccountMenu} 
        anchorEl={accountAnchorEl}
        placement="bottom-end"
        transition
        sx={(theme) => ({ zIndex: theme.zIndex.tooltip })}
      >
        {({ TransitionProps }) => (
          <Grow 
            {...TransitionProps} 
            timeout={350}
            style={{ transformOrigin: "top right" }}
          >
            <Paper
              ref={accountMenuRef}
              sx={{
                borderRadius: "8px",
                maxWidth: "240px",
                backgroundColor: "#353740",
              }}
            >
              <List 
                sx={{ 
                  px: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1
                }}
              >
                <ListItemButton
                  sx={{
                    py: 0.5,
                    ":hover": {
                      backgroundColor: "#44464e"
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2
                    }}
                  >
                    {
                      picture && 
                      (
                        <Avatar
                          src={picture}
                          sx={{
                            width: "24px",
                            height: "24px"
                          }}
                        />
                      )
                    }

                    {
                      !picture &&
                      (
                        <Avatar
                          sx={{
                            backgroundColor: "#78909C",
                            width: "24px",
                            height: "24px",
                            fontSize: "0.8rem"
                          }}
                        >
                          {name ? name[0].toUpperCase() : " "}
                        </Avatar>
                      )
                    }
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
                        {name}
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
                        {email}
                      </Typography>
                    </Box>
                  </Box>
                </ListItemButton>

                <Divider sx={{ backgroundColor: "#4e4f56" }} />

                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    px: 2,
                    py: 0.8,
                    ":hover": {
                      backgroundColor: "#44464e"
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "35px" }}>
                    <LogoutRoundedIcon sx={{ fontSize: "1rem", color: "#dadadb" }} />
                  </ListItemIcon>
                  <Typography sx={{ color: "#FFFFFF", fontSize: "0.9rem", fontWeight: 500 }}>
                    Log out
                  </Typography>
                </ListItemButton>
              </List>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}
