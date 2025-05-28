import { useNavigate } from "react-router-dom"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded"

export default function VerifyEmailSuccess({ email }) {
  const navigate = useNavigate()

  return (
    <Box 
      sx={{ 
        display: "flex",
        flexDirection: "column", 
        alignItems: "center",
        justifyContent: "center",
        gap: 1
      }}
    >
      <MarkEmailReadRoundedIcon sx={{ fontSize: "3rem", color: "#6ccc7e" }} />
      <Typography
        variant="h0"
        sx={{ 
          fontWeight: 600,
          textAlign: "center"
        }}
        >
        Account verified
      </Typography>
      <Typography sx={{ textAlign: "center" }}>
        Congratulations! Your email account <strong>{email}</strong> has been verified.
      </Typography>
      <Button 
        onClick={() => navigate("/login")}
        variant="contained"
        sx={{
          mt: 1.2,
          borderRadius: 3,
          py: 1,
          textTransform: "none",
          fontWeight: 600,
          boxShadow:
            "0px 1px 5px 0px rgba(0, 0, 0, 0.06), 0px 2px 2px 0px rgba(0, 0, 0, 0.03), 0px 3px 1px -2px rgba(0, 0, 0, 0.05)",
          "&:hover": {
            boxShadow:
              "0px 1px 5px 0px rgba(0, 0, 0, 0.06), 0px 2px 2px 0px rgba(0, 0, 0, 0.03), 0px 3px 1px -2px rgba(0, 0, 0, 0.05)"
          }
        }}
      >
        Go to Login page
      </Button>
    </Box>
  )
}
