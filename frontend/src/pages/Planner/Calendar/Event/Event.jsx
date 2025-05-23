import { memo, useRef, useState, useLayoutEffect } from "react"
import { usePlannerContext } from "~/hooks/useContext"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { getStrTime } from "~/utils/datetime"
import Grow from "@mui/material/Grow"

function Event({ props }) {
  const { args, anchorEl } = props
  const taskId = args.event.id
  const taskName = args.event.extendedProps.name
  const { targetTask } = usePlannerContext()
  const eventRef = useRef(null)

  const compactEventHeightThreshold = 37
  const expandedEventHeightThreshold = 55
  const [eventHeight, setEventHeight] = useState(0)

  const setRefs = (element) => {
    eventRef.current = element
    if (element) anchorEl.current = element // Set anchor element for task create poppup
  }

  useLayoutEffect(() => {
    // Update event's height after Event component is fully rendered
    if (!eventRef.current) return
    setEventHeight(eventRef.current.offsetHeight)
  }, [eventRef.current?.offsetHeight])

  return (
    <Grow in={true} timeout={{ enter: 0, exit: 500 }}>
      <Box
        ref={setRefs}
        sx={{
          maxWidth: "100%",
          height: "100%",
          padding: "4px",
          display: "flex",
          flexDirection:
            eventHeight > expandedEventHeightThreshold ? "column" : "row",
          alignItems: "center",
          borderRadius: "8px",
          border: taskId === targetTask?.id ? "none" : "1px solid #F0CAC4",
          boxShadow:
            taskId === targetTask?.id
              ? "0 5px 15px rgba(11, 27, 161, .35)"
              : "none",
          gap: 0.8,
          transition: "flex-direction 0.3s ease-in-out",

          "&:hover": {
            transition: "0.3s",
            backgroundColor: "taskColorPalette.pink.dark"
          }
        }}
      >
        {taskName ? (
          <Box
            sx={{
              maxWidth: "100%",
              padding:
                eventHeight > expandedEventHeightThreshold
                  ? "4px 4px 0px 4px"
                  : "4px 0px 4px 4px"
            }}
          >
            <Typography
              variant={
                eventHeight > compactEventHeightThreshold ? "body1" : "body2"
              }
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "clip"
              }}
            >
              {taskName}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              maxWidth: "100%",
              padding:
                eventHeight > expandedEventHeightThreshold
                  ? "4px 4px 0px 4px"
                  : "4px 0px 4px 4px"
            }}
          >
            <Typography
              variant={
                eventHeight > compactEventHeightThreshold ? "body1" : "body2"
              }
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "clip"
              }}
            >
              No title
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            maxWidth: "100%",
            padding:
              eventHeight > expandedEventHeightThreshold
                ? "0px 4px 4px 4px"
                : "4px 4px 4px 0px",
            overflow: "hidden",
            textOverflow: "clip",
            whiteSpace: "nowrap"
          }}
        >
          <Typography
            variant={
              eventHeight > compactEventHeightThreshold ? "body1" : "body2"
            }
            sx={{
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "clip"
            }}
          >
            {getStrTime(args.event.start)} - {getStrTime(args.event.end)}
          </Typography>
        </Box>
      </Box>
    </Grow>
  )
}

export default memo(Event)
