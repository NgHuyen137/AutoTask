import { useMediaQuery } from "@mui/material"
import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useVerifyPasswordResetToken } from "~/hooks/useQuery"
import { useResetPassword } from "~/hooks/useMutation"

import Spinner from "~/components/ui/Spinner"
import PasswordResetRequestForm from "../PasswordResetRequestForm/PasswordResetRequestForm"
import CustomSubmitButton from "~/components/ui/CustomSubmitButton"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import OutlinedInput from "@mui/material/OutlinedInput"
import FormHelperText from "@mui/material/FormHelperText"
import InputAdornment from "@mui/material/InputAdornment"
import KeyRoundedIcon from "@mui/icons-material/KeyRounded"
import LockRoundedIcon from "@mui/icons-material/LockRounded"
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded"

export default function PasswordResetForm() {
  const [verifyEmail, setVerifyEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [passwordError, setPasswordError] = useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [resetPasswordError, setResetPasswordError] = useState(false)

  const { resetToken } = useParams() 
  const { 
    verifyResponse, 
    isLoading: isVerifying, 
    isSuccess: isVerifySuccess
  } = useVerifyPasswordResetToken(resetToken)

  useEffect(() => {
    if (isVerifySuccess) 
      setVerifyEmail(verifyResponse["email"])
  }, [isVerifySuccess])

  const handlePasswordChange = (event) => {
    const minimumLength = 8
    const newPassword = event.target.value

    if (newPassword !== password) 
      setResetPasswordError(false)

    setPassword(newPassword)
    if (newPassword.length < minimumLength)
      setPasswordError(true)
    else
      setPasswordError(false)
  }

  const handleConfirmPasswordChange = (event) => {
    const minimumLength = 8
    const newConfirmPassword = event.target.value
    
    if (newConfirmPassword !== confirmPassword) 
      setResetPasswordError(false)
    
    setConfirmPassword(newConfirmPassword)
    if (newConfirmPassword.length < minimumLength)
      setConfirmPasswordError(true)
    else
      setConfirmPasswordError(false)
  }

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev)
  }

  const { 
    resetPassword, 
    isLoading: isResetting, 
    isSuccess: isResetSuccess
  } = useResetPassword()
  const handleResetPassword = () => {
    if (!passwordError && !confirmPasswordError && !resetPasswordError) {
      const data = {
        "email": verifyEmail,
        "new_password": password,
        "confirm_password": confirmPassword 
      }

      resetPassword(data, {
        onError: () => setResetPasswordError(true)
      })
    }
  }

  const isLessThan464 = useMediaQuery("(max-width: 464px)")

  if (isVerifying) 
    return <Spinner />

  if (isVerifySuccess) {
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
            <KeyRoundedIcon sx={{ fontSize: "3rem", color: "#6cba87" }} />
            <Typography
              variant="h0"
              sx={{ 
                fontWeight: 600,
                textAlign: "center"
              }}
              >
              Set New Password
            </Typography>
            <Typography sx={{ textAlign: "center" }}>
              Your new password must be different to your previously used password.
            </Typography>
          </Box>
          
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              marginTop: 4
            }}
          >
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              id="password"
              placeholder="Enter new password"
              startAdornment={
                <InputAdornment position="start">
                  <LockRoundedIcon sx={{ color: "#A2A2A2", fontSize: "1rem" }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <Tooltip title={showPassword ? "Show password" : "Hide password"}>
                    <IconButton 
                      onClick={handleTogglePassword} edge="end"
                      sx={{
                        padding: "4px",
                        marginRight: "-4px"
                      }}
                    >
                      {
                        showPassword ? 
                        <Visibility sx={{ fontSize: "1.2rem" }} /> : 
                        <VisibilityOff sx={{ fontSize: "1.2rem" }} />
                      }
                    </IconButton>
                  </Tooltip>
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
            {passwordError && (
              <FormHelperText
                error={passwordError}
                sx={{ alignSelf: "flex-start", margin: "0 0 0 3px" }}
              >
                Must be at least 8 characters!
              </FormHelperText>
            )}

            <OutlinedInput
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              id="confirm-password"
              placeholder="Enter confirm password"
              startAdornment={
                <InputAdornment position="start">
                  <LockRoundedIcon sx={{ color: "#A2A2A2", fontSize: "1rem" }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <Tooltip title={showPassword ? "Show confirm password" : "Hide confirm password"}>
                    <IconButton 
                      onClick={handleToggleConfirmPassword} edge="end"
                      sx={{
                        padding: "4px",
                        marginRight: "-4px"
                      }}
                    >
                      {
                        showConfirmPassword ? 
                        <Visibility sx={{ fontSize: "1.2rem" }} /> : 
                        <VisibilityOff sx={{ fontSize: "1.2rem" }} />
                      }
                    </IconButton>
                  </Tooltip>
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
            {confirmPasswordError && (
              <FormHelperText
                error={confirmPasswordError}
                sx={{ alignSelf: "flex-start", margin: "0 0 0 3px" }}
              >
                Must be at least 8 characters!
              </FormHelperText>
            )}

            {
              resetPasswordError &&
              (
                <Typography sx={{ color: "#D3302F", fontWeight: 600, textAlign: "center" }}>
                  Passwords do not match!
                </Typography>
              )
            }

            {
              isResetSuccess &&
              (
                <Typography sx={{ color: "#6cba87", fontWeight: 600, textAlign: "center" }}>
                  Your password has been reset successfully!
                </Typography>
              )
            }

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.8
              }}
            >
              <CustomSubmitButton 
                buttonName="Reset password"
                handleClick={handleResetPassword}
                isLoading={isResetting}
                isSuccess={isResetSuccess}
                props={{
                  mt: 1.2,
                  borderRadius: 3,
                  py: 1                                                                 
                }}
              />

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
          </Box>
        </Paper>
      </Container>
    )
  }

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
            Reset Link Expired
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            The link to reset your password has expired. Please request a new link to reset your password.
          </Typography>
        </Box>

        <PasswordResetRequestForm />

      </Paper>
    </Container>
  )
}
