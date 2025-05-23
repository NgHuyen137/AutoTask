import { useMediaQuery } from "@mui/material"
import { useLocation } from "react-router-dom"

import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import MarkEmailUnreadRoundedIcon from "@mui/icons-material/MarkEmailUnreadRounded"

export default function VerifyEmailReminder() {
  const location = useLocation()
  const email = location.state?.email || ""

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
          <MarkEmailUnreadRoundedIcon sx={{ fontSize: "3rem", color: "#fabc50" }} />
          <Typography
            variant="h0"
            sx={{ 
              fontWeight: 600,
              textAlign: "center"
            }}
            >
            Verify your email
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            We've sent an email to <strong>{email}</strong>. Continue account creation using the link via email. 
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}
