import validator from "validator"
import { Link, useNavigate } from "react-router"
import { useState } from "react"
import { useCreateNewAccount } from "~/hooks/useMutation"
import { useMediaQuery } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"

import CustomSubmitButton from "~/components/ui/CustomSubmitButton"

import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import OutlinedInput from "@mui/material/OutlinedInput"
import FormHelperText from "@mui/material/FormHelperText"
import InputAdornment from "@mui/material/InputAdornment"
import MailRoundedIcon from "@mui/icons-material/MailRounded"
import LockRoundedIcon from "@mui/icons-material/LockRounded"
import PortraitRoundedIcon from "@mui/icons-material/PortraitRounded"

export default function Signup() {
  // Manage Signup form states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Manage errors
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [signupError, setSignupError] = useState(false)
  
  const handleNameChange = (event) => setName(event.target.value)

  const handleEmailChange = (event) => {
    const newEmail = event.target.value
    if (newEmail != email)
      setSignupError(false)

    setEmail(newEmail)

    if (validator.isEmail(newEmail))
      setEmailError(false)
    else
      setEmailError(true)
  }

  const handlePasswordChange = (event) => {
    const minimumLength = 8
    const newPassword = event.target.value
    setPassword(newPassword)
    if (newPassword.length < minimumLength)
      setPasswordError(true)
    else
      setPasswordError(false)
  }

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  const navigate = useNavigate()
  const { createNewAccount, isLoading, isSuccess, reset } = useCreateNewAccount()
  const handleFormSubmit = () => {
    const newAccountData = {
      "name": name,
      "email": email,
      "password": password
    }

    if (!signupError && !emailError && !passwordError)
      createNewAccount(newAccountData, {
        onSuccess: () => {
          navigate("/verify", { state: { email }, replace: true })
        },
        onError: () => setSignupError(true)
      })
    }

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
          minWidth: isLessThan464 ? "80vw" : "400px",
          padding: 4,
          borderRadius: "12px",
          boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.03),0px 3px 14px 2px rgba(0, 0, 0, 0.05)"
        }}
      >
        <Typography
          variant="h0"
          fontWeight={510}
          color="primary.dark"
          sx={{ wordSpacing: "2px" }}
        >
          Create your account
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
              Name
            </Typography>
            <OutlinedInput
              value={name}
              onChange={handleNameChange}
              id="name"
              placeholder="Enter your name"
              startAdornment={
                <InputAdornment position="start">
                  <PortraitRoundedIcon sx={{ color: "#A2A2A2", fontSize: "1rem" }} />
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
          </Box>
          
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
                sx={{ alignSelf: "flex-start", margin: "0 0 0 3px" }}
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
              placeholder="Create password"
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
          </Box>

          {
            signupError && 
            (
              <Typography sx={{ color: "#D3302F", fontWeight: 600, textAlign: "center" }}>
                Email has been used!
              </Typography>
            )
          }
          
          <CustomSubmitButton 
            buttonName="Sign Up"
            handleClick={handleFormSubmit}
            isLoading={isLoading}
            isSuccess={isSuccess}
            props={{
              mt: 1.2,
              borderRadius: 3,
              py: 1                                                                 
            }}
          />

          <Typography sx={{ color: "text.primary", textAlign: "center" }}>
            Already have an account?{" "}
            <Typography 
              component={Link}
              to="/login"
              sx={{ 
                color: "primary.dark", 
                cursor: "pointer", 
                textDecoration: "none",
                fontWeight: 600
              }}
            >
              Login
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}
