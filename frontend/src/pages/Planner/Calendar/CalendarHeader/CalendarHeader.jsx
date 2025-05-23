import { useEffect, useState, useRef } from "react"
import { usePlannerContext } from "~/hooks/useContext"
import { getCurrentEndOfWeek } from "~/utils/datetime"
import Box from "@mui/material/Box"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

const useDisplayedDay = (calendarRef, setDisplayedDay) => {
  useEffect(() => {
    const updateDisplayedDay = (info) => {
      setDisplayedDay(info.start.toLocaleDateString("en-CA"))
    }

    if (!calendarRef.current) return
    const calendarApi = calendarRef.current.getApi()

    calendarApi.on("datesSet", updateDisplayedDay)
    return () => calendarApi.off("datesSet", updateDisplayedDay)
  }, [])
}

const useResponsiveCalendarHeader = (
  calendarHeaderRef,
  setJustifyContent,
  responsiveThreshold
) => {
  useEffect(() => {
    if (!calendarHeaderRef.current) return

    const observer = new ResizeObserver(() => {
      const width = calendarHeaderRef.current.offsetWidth
      setJustifyContent(
        width <= responsiveThreshold ? "center" : "space-between"
      )
    })

    observer.observe(calendarHeaderRef.current)
    return () => observer.disconnect()
  }, [])
}

export default function CalendarHeader({ calendarRef }) {
  const getCurrentMonthYear = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      const currentMonthYear = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric"
      }).format(calendarApi.getDate())

      return currentMonthYear
    }
  }

  const calendarHeaderRef = useRef(null)
  const responsiveThreshold = 266 // Threshold of Calendar header width
  const [justifyContent, setJustifyContent] = useState("space-between")

  const { endOfWeek, calendarView } = usePlannerContext()
  const currentEndOfWeek = getCurrentEndOfWeek()

  const [displayedDay, setDisplayedDay] = useState(null)
  useDisplayedDay(calendarRef, setDisplayedDay)
  const currentDay = new Date().toLocaleDateString("en-CA")

  useResponsiveCalendarHeader(
    calendarHeaderRef,
    setJustifyContent,
    responsiveThreshold
  )

  return (
    <AppBar
      position="static"
      elevation={0}
      ref={calendarHeaderRef}
      sx={{
        height: "48px",
        boxShadow: "none",
        backgroundColor: "background.default"
      }}
    >
      <Toolbar
        sx={{
          padding: "8px 16px",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: justifyContent
        }}
      >
        <Typography
          fontSize="1.1rem"
          fontWeight={600}
          color="text.primary"
          sx={{ textAlign: "center" }}
        >
          {getCurrentMonthYear()}
        </Typography>

        <Box>
          {calendarView === "timeGridWeek" &&
            currentEndOfWeek !== endOfWeek && (
              <Button
                onClick={() => {
                  if (calendarRef.current) {
                    const calendarApi = calendarRef.current?.getApi()
                    calendarApi.today()
                  }
                }}
                sx={{ borderRadius: "40px" }}
              >
                <Typography
                  fontWeight={500}
                  color="primary.dark"
                  sx={{ textTransform: "none" }}
                >
                  This week
                </Typography>
              </Button>
            )}

          {calendarView === "timeGridDay" && currentDay !== displayedDay && (
            <Button
              onClick={() => {
                if (calendarRef.current) {
                  const calendarApi = calendarRef.current?.getApi()
                  calendarApi.today()
                }
              }}
              sx={{ borderRadius: "40px" }}
            >
              <Typography
                fontWeight={500}
                color="primary.dark"
                sx={{ textTransform: "none" }}
              >
                Today
              </Typography>
            </Button>
          )}
          <IconButton
            onClick={() => {
              if (calendarRef.current) {
                const calendarApi = calendarRef.current.getApi()
                calendarApi.prev()
              }
            }}
          >
            <ArrowBackIcon sx={{ fontSize: "1rem", color: "text.primary" }} />
          </IconButton>
          <IconButton
            onClick={() => {
              if (calendarRef.current) {
                const calendarApi = calendarRef.current.getApi()
                calendarApi.next()
              }
            }}
          >
            <ArrowForwardIcon
              sx={{ fontSize: "1rem", color: "text.primary" }}
            />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
