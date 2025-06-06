import validator from "validator"
import { Link, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useLogin } from "~/hooks/useMutation"
import { useAuthContext } from "~/hooks/useContext"
import { useMediaQuery } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"

import Spinner from "~/components/ui/Spinner"
import CustomSubmitButton from "~/components/ui/CustomSubmitButton"

import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import SvgIcon from "@mui/material/SvgIcon"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import OutlinedInput from "@mui/material/OutlinedInput"
import FormHelperText from "@mui/material/FormHelperText"
import InputAdornment from "@mui/material/InputAdornment"
import MailRoundedIcon from "@mui/icons-material/MailRounded"
import LockRoundedIcon from "@mui/icons-material/LockRounded"

export default function Login() {
  // Manage Login form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [emailVerified, setEmailVerified] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Manage access token
  const { setAccessToken, setUser } = useAuthContext()

  // Manage errors
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [loginError, setLoginError] = useState(false)
  
  const handleEmailChange = (event) => {
    const newEmail = event.target.value
    if (newEmail !== email) {
      setLoginError(false)
      setEmailVerified(true)
    }

    setEmail(newEmail)

    if (validator.isEmail(newEmail))
      setEmailError(false)
    else
      setEmailError(true)
  }

  const handlePasswordChange = (event) => {
    const minimumLength = 8
    const newPassword = event.target.value

    if (newPassword !== password) 
      setLoginError(false)

    setPassword(newPassword)
    if (newPassword.length < minimumLength)
      setPasswordError(true)
    else
      setPasswordError(false)
  }

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }


  const { loginAccount, isLoading, isSuccess } = useLogin()
  const handleFormSubmit = () => {
    const formData = new URLSearchParams()
    formData.append("username", email)
    formData.append("password", password)

    if (email === "")
      setEmailError(true)
    if (password === "")
      setPasswordError(true)

    if (
      email !== "" && password !== "" &&
      !loginError && !emailError && !passwordError
    )
      loginAccount(formData, {
        onSuccess: (res) => {
          setAccessToken(res["access_token"])
        },
        onError: (res) => {
          if (res.response.status === 403)
            setEmailVerified(false)
          else if (res.response.status === 401)
            setLoginError(true)
        }
      })
  }

  const handleLoginWithGoogle = () => {
    window.location.href = "http://localhost:8000/api/v1/auth/login/google"
  }

  const isLessThan464 = useMediaQuery("(max-width: 464px)")

  if (isLoading)
    return (
      <Spinner />
    )

  if (isSuccess)
    return <Navigate to="/planner" replace={true} />

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
          minWidth: isLessThan464 ? "80vw" : "400px",
          padding: 4,
          borderRadius: "12px",
          boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.03),0px 3px 14px 2px rgba(0, 0, 0, 0.05)"
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Typography
            variant="h0"
            fontWeight={600}
            color="primary.dark"
            sx={{ wordSpacing: "2px", textAlign: "center" }}
          >
            LOGIN
          </Typography>
          <Box
            component="form"
            sx={{ 
              display: "flex",
              flexDirection: "column",
              marginTop: 4,
              gap: 2
            }}
          >
            <Box 
              sx={{ 
                display: "flex",
                flexDirection: "column",
                gap: 0.8
              }}
            >
              <Typography fontWeight={510}>
                Email
                <Typography component="span" color="error" fontWeight={510}> *</Typography>
              </Typography>
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
              {emailError && (
                <FormHelperText
                  error={emailError}
                  sx={{ alignSelf: "flex-start", margin: "0 0 0 3px", fontWeight: 500 }}
                >
                  Invalid Email!
                </FormHelperText>
              )}
            </Box>

            <Box
              sx={{ 
                display: "flex",
                flexDirection: "column",
                gap: 0.8
              }}
            >
              <Typography fontWeight={510}>
                Password
                <Typography component="span" color="error" fontWeight={510}> *</Typography>
              </Typography>
              <OutlinedInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                id="password"
                placeholder="Enter your password"
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
                  sx={{ alignSelf: "flex-start", margin: "0 0 0 3px", fontWeight: 500 }}
                >
                  Must be at least 8 characters!
                </FormHelperText>
              )}
            </Box>
            
            <Typography 
              component={Link}
              to="/forgot-password"
              sx={{ 
                alignSelf: "flex-end",
                width: "fit-content",
                color: "text.primary", 
                textDecoration: "none" 
              }}
            > 
              Forgot Password?
            </Typography>

            {
              loginError &&
              (
                <Typography sx={{ color: "#D3302F", fontWeight: 600, textAlign: "center" }}>
                  Incorrect email or password. Please try again!
                </Typography>
              )
            }

            {
              !emailVerified &&
              (
                <Typography sx={{ color: "#D3302F", fontWeight: 600, textAlign: "center" }}>
                  Please verify your email first!
                </Typography>
              )
            }

            {
              isSuccess &&
              (
                <Typography sx={{ color: "#6cba87", fontWeight: 600, textAlign: "center" }}>
                  You have logged in successfully!
                </Typography>
              )
            }

            <CustomSubmitButton 
              buttonName="LOGIN"
              handleClick={handleFormSubmit}
              isLoading={isLoading}
              isSuccess={isSuccess}
              props={{
                mt: 1.2,
                borderRadius: 3,
                py: 1                                                                 
              }}
            />

            <Stack direction="row" alignItems="center" spacing={2}>
              <Divider sx={{ flex: 1, color: "#f8f9fa" }} />
              <Typography color="#6c757d" fontWeight={600}>
                OR
              </Typography>
              <Divider sx={{ flex: 1, color: "#f8f9fa" }} />
            </Stack>

            <Button
              onClick={handleLoginWithGoogle}
              variant="contained"
              sx={{
                borderRadius: 3,
                py: "11px",
                textTransform: "none",
                fontWeight: 600,
                color: "text.primary",
                backgroundColor: "#f8f9fa",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                  backgroundColor: "#e9ecef"
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
                <SvgIcon sx={{ fontSize: "1rem"}}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 128 128"
                    width="1em"
                    height="1em"
                  >
                    <path
                      fill="#fff"
                      d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.33 74.33 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.16 36.16 0 0 1-13.93 5.5a41.29 41.29 0 0 1-15.1 0A37.16 37.16 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.31 38.31 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.28 34.28 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38z"
                    ></path>
                    <path
                      fill="#e33629"
                      d="M44.59 4.21a64 64 0 0 1 42.61.37a61.22 61.22 0 0 1 20.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 0 0-13.64-8a37.17 37.17 0 0 0-37.46 9.74a39.25 39.25 0 0 0-9.18 14.91L8.76 35.6A63.53 63.53 0 0 1 44.59 4.21z"
                    ></path>
                    <path
                      fill="#f8bd00"
                      d="M3.26 51.5a62.93 62.93 0 0 1 5.5-15.9l20.73 16.09a38.31 38.31 0 0 0 0 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 0 1-5.5-40.9z"
                    ></path>
                    <path
                      fill="#587dbd"
                      d="M65.27 52.15h59.52a74.33 74.33 0 0 1-1.61 33.58a57.44 57.44 0 0 1-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0 0 12.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z"
                    ></path>
                    <path
                      fill="#319f43"
                      d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0 0 44 95.74a37.16 37.16 0 0 0 14.08 6.08a41.29 41.29 0 0 0 15.1 0a36.16 36.16 0 0 0 13.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 0 1-25.9 13.47a67.6 67.6 0 0 1-32.36-.35a63 63 0 0 1-23-11.59A63.73 63.73 0 0 1 8.75 92.4z"
                    ></path>
                  </svg>
                </SvgIcon>
                <Typography fontWeight={600} color="text.primary">
                  Continue with Google
                </Typography>
              </Box>
            </Button>

            <Typography sx={{ color: "text.primary", textAlign: "center", mt: 2 }}>
              Don't have an account?{" "}
              <Typography 
                component={Link}
                to="/signup"
                sx={{ 
                  color: "primary.dark", 
                  cursor: "pointer", 
                  textDecoration: "none",
                  fontWeight: 600
                }}
              >
                Register
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
