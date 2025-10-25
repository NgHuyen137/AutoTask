import { useRef, useState } from "react"
import { useHeightObserver } from "~/hooks/useEffect"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import EastRoundedIcon from "@mui/icons-material/EastRounded"
import pageNotFoundImage from "~/assets/images/page_not_found.png"
import { Link } from "react-router-dom"

export default function NotFound() {
  const imgRef = useRef(null)
  const [imgHeight, setImgHeight] = useState(0)

  useHeightObserver(imgRef, setImgHeight)

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#FFF",
        padding: 2,
        borderRadius: "8px",
        display: "flex",
        gap: 2,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 400
        }}
      >
        <Box
          ref={imgRef}
          component="img"
          src={pageNotFoundImage}
          alt="Page not found!"
          sx={{
            width: "100%",
            height: "auto"
          }}
        />
        <Typography
          sx={{
            fontWeight: 600,
            position: "absolute",
            textAlign: "center",
            top: `${0.9 * imgHeight}px`,
            fontSize: { xs: "1.4rem", sm: "1.6rem" },
            width: "100%"
          }}
        >
          Page not found
        </Typography>
      </Box>
      <Button
        component={Link}
        to="/planner"
        variant="contained"
        endIcon={<EastRoundedIcon />}
        sx={{
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 600,
          py: 1,
          px: 6
        }}
      >
        Go back to home page
      </Button>
    </Box>
  )
}
