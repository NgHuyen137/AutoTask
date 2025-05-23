import validator from "validator"
import { Link } from "react-router"
import { useState, useEffect } from "react"
import { useSendPasswordResetEmail } from "~/hooks/useMutation"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import OutlinedInput from "@mui/material/OutlinedInput"
import InputAdornment from "@mui/material/InputAdornment"
import MailRoundedIcon from "@mui/icons-material/MailRounded"
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded"

const showSuccessMessage = (isSuccess, setShowSuccess) => {
  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true)

      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isSuccess])
}

export default function PasswordResetRequestForm() {
  const [email, setEmail] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [emailError, setEmailError] = useState(false)
  const [emailExistError, setEmailExistError] = useState(false)

  const handleEmailChange = (event) => {
    const newEmail = event.target.value
    if (newEmail !== email)
      setEmailExistError(false)

    setEmail(newEmail)

    if (validator.isEmail(newEmail))
      setEmailError(false)
    else
      setEmailError(true)
  }

  const { sendPasswordResetEmail, isLoading, isSuccess, reset } = useSendPasswordResetEmail()
  const handleSendEmail = () => {
    if (!emailError && !emailExistError)
      sendPasswordResetEmail({"email": email}, {
        onError: () => setEmailExistError(true)
      })
  }

  showSuccessMessage(isSuccess, setShowSuccess)

  return (
    <Box 
      sx={{ 
        display: "flex",
        flexDirection: "column",
        mt: 3,
        gap: 0.8
      }}
    >
      <OutlinedInput
        value={email}
        onChange={handleEmailChange}
        id="email-address"
        placeholder="Enter your email"
        startAdornment={
          <InputAdornment position="start">
            <MailRoundedIcon sx={{ color: "#A2A2A2", fontSize: "1rem" }} />
          </InputAdornment>
        }
        sx={{
          width: "100%",
          borderRadius: 3,
          "& .MuiOutlinedInput-input": {
            py: "12px"
          }
        }}
      />

      {
        emailError && 
        (
          <Typography sx={{ color: "#D3302F", fontWeight: 600, textAlign: "center" }}>
            Invalid email!
          </Typography>
        )
      }

      {
        emailExistError && 
        (
          <Typography sx={{ color: "#D3302F", fontWeight: 600, textAlign: "center" }}>
            Email does not exist!
          </Typography>
        )
      }

      {
        showSuccess &&
        (
          <Typography sx={{ color: "#6cba87", fontWeight: 600, textAlign: "center" }}>
            Email has been sent!
          </Typography>
        )
      }

      <Button 
        onClick={handleSendEmail}
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
        Send email
      </Button>

      <Button
        component={Link}
        to="/login"
        sx={{
          mt: 1.2,
          borderRadius: 3,
          py: 1,
          color: "text.primary",
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none"
          }
        }}
      >
        <ArrowBackRoundedIcon sx={{ fontSize: "1.2rem", mr: 1 }} />
        Back to Login
      </Button>
    </Box>
  )
}
