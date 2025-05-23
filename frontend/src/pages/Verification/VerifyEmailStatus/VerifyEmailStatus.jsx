import { useMediaQuery } from "@mui/material"
import { useParams } from "react-router"
import { useVerifyEmail } from "~/hooks/useQuery"

import VerifyEmailSuccess from "./VerifyEmailSuccess/VerifyEmailSuccess"
import VerifyEmailFailed from "./VerifyEmailFailed/VerifyEmailFailed"

import Paper from "@mui/material/Paper"
import Container from "@mui/material/Container"
import { useEffect, useState } from "react"

export default function VerifyEmailStatus() {
  const [statusCode, setStatusCode] = useState(400)
  const [verifyEmail, setVerifyEmail] = useState("")

  const { verifyToken } = useParams() 
  const verifyResponse = useVerifyEmail(verifyToken)

  useEffect(() => {
    if (verifyResponse) {
      if ("status_code" in verifyResponse && "email" in verifyResponse) {
        setStatusCode(verifyResponse["status_code"])
        setVerifyEmail(verifyResponse["email"])
      }
    }
  }, [verifyResponse])

  const isLessThan464 = useMediaQuery("(max-width: 464px)")

  if (statusCode === 200) {
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
          <VerifyEmailSuccess email={verifyEmail} />
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
        <VerifyEmailFailed />
      </Paper>
    </Container>
  )
}
