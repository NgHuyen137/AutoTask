import { useMediaQuery } from "@mui/material"

import PasswordResetRequestForm from "../PasswordResetRequestForm/PasswordResetRequestForm"

import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import KeyRoundedIcon from "@mui/icons-material/KeyRounded"

export default function PasswordResetConfirm() {
  const isLessThan464 = useMediaQuery("(max-width: 464px)")

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ 
        height: "100vh", 
        display: "flex", 
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      }}
    >
      <Paper 
        sx={{ 
          maxWidth: isLessThan464 ? "80vw" : "400px",
          padding: 4,
          borderRadius: "12px",
          boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.03),0px 3px 14px 2px rgba(0, 0, 0, 0.05)"
        }}
      >
        <Box 
          sx={{ 
            display: "flex",
            flexDirection: "column", 
            alignItems: "center",
            justifyContent: "center",
            gap: 1
          }}
        >
          <KeyRoundedIcon sx={{ fontSize: "3rem", color: "#d3302f" }} />
          <Typography
            variant="h0"
            sx={{ 
              fontWeight: 600,
              textAlign: "center"
            }}
            >
            Forgot Password?
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            We’ll send you a link to create a new password.
          </Typography>
        </Box>

        <PasswordResetRequestForm />
        
      </Paper>
    </Container>
  )
}
