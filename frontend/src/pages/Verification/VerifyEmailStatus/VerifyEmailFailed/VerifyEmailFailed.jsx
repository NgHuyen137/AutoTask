import validator from "validator"
import { useState, useEffect, use } from "react"
import { useSendEmailVerification } from "~/hooks/useMutation"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import OutlinedInput from "@mui/material/OutlinedInput"
import InputAdornment from "@mui/material/InputAdornment"
import Typography from "@mui/material/Typography"
import MailRoundedIcon from "@mui/icons-material/MailRounded"
import ReportGmailerrorredRoundedIcon from "@mui/icons-material/ReportGmailerrorredRounded"

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

export default function VerifyEmailFailed() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState(false)
  const [emailExistError, setEmailExistError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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

  const { sendEmailVerification, isLoading, isSuccess, reset } = useSendEmailVerification()
  const handleResendVerificationLink = () => {
    if (!emailError && !emailExistError)
      sendEmailVerification({"email": email}, {
        onError: () => setEmailExistError(true)
      })
  }

  showSuccessMessage(isSuccess, setShowSuccess)

  return (
    <>
      <Box 
        sx={{ 
          display: "flex",
          flexDirection: "column", 
          alignItems: "center",
          justifyContent: "center",
          gap: 1
        }}
      >
        <ReportGmailerrorredRoundedIcon sx={{ fontSize: "3rem", color: "#d3302f" }} />
        <Typography
          variant="h0"
          sx={{ 
            fontWeight: 600,
            textAlign: "center"
          }}
          >
          Verification link expired
        </Typography>
        <Typography sx={{ textAlign: "center" }}>
          Looks like the email verification link has expired. No worries we can send the link again.
        </Typography>
      </Box>

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
              Email verification link has been sent!
            </Typography>
          )
        }

        <Button 
          onClick={handleResendVerificationLink}
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
          Resend verification link
        </Button>
      </Box>
    </>
  )
}
