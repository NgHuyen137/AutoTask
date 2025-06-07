import { useState, useRef, useLayoutEffect, useEffect } from "react"
import { useFetchAllSchedulingHours } from "~/hooks/useQuery"
import SchedulingHourSelector from "~/components/TaskComponents/SchedulingHourSelector/SchedulingHourSelector"
import DurationInput from "~/components/TaskComponents/DurationInput/DurationInput"
import DateTimePicker from "~/components/TaskComponents/DateTimePicker/DateTimePicker"
import Box from "@mui/material/Box"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Collapse from "@mui/material/Collapse"
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded"
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded"
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded"
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded"
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded"

const useResponsiveSchedulingUpdate = (
  taskSchedulingUpdateRef,
  setDatetimeGap,
  setDatetimeMinWidth,
  responsiveThreshold
) => {
  useLayoutEffect(() => {
    if (!taskSchedulingUpdateRef.current) return

    const observer = new ResizeObserver(() => {
      const width = taskSchedulingUpdateRef.current.offsetWidth
      setDatetimeGap(width <= responsiveThreshold ? 2 : 1.5)
      setDatetimeMinWidth(width <= responsiveThreshold ? 340 : 250)
    })

    observer.observe(taskSchedulingUpdateRef.current)
    return () => observer.disconnect()
  }, [])
}

const updateSplit = (task, split, setSplit) => {
  useLayoutEffect(() => {
    if (task.split && !split)
      setSplit(true)
    if (!task.split && split)
      setSplit(false)
  }, [task.split])
}

export default function TaskSchedulingUpdate({
  taskState,
  startDatetimeErrorState,
  endDatetimeErrorState,
  startDateErrorState,
  dueDateErrorState
}) {
  const [expand, setExpand] = useState(false)
  const { task, updateTask } = taskState
  const [split, setSplit] = useState(false)

  const taskSchedulingUpdateRef = useRef(null)
  const [datetimeGap, setDatetimeGap] = useState(1.5)
  const [datetimeMinWidth, setDatetimeMinWidth] = useState(250)
  const responsiveThreshold = 547

  const schedulingHours = useFetchAllSchedulingHours()

  updateSplit(task, split, setSplit)

  useResponsiveSchedulingUpdate(
    taskSchedulingUpdateRef,
    setDatetimeGap,
    setDatetimeMinWidth,
    responsiveThreshold
  )

  return (
    <Box
      ref={taskSchedulingUpdateRef}
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        padding: "16px"
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "auto auto",
          gridTemplateColumns: "auto 32px",
          alignItems: "center",
          marginBottom: expand ? "16px" : 0,
          transition: "margin-bottom 350ms ease-in-out"
        }}
      >
        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: 600,
            gridColumn: "1"
          }}
        >
          Scheduling
        </Typography>
        <Typography
          sx={{
            fontSize: "0.9rem",
            gridColumn: "1"
          }}
        >
          Hours, duration, & scheduling preferences
        </Typography>
        <IconButton
          onClick={() => setExpand(!expand)}
          sx={{
            gridColumn: "2",
            gridRow: "1 / span 2",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            placeSelf: "center"
          }}
        >
          {expand ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
        </IconButton>
      </Box>

      <Collapse in={expand} timeout={350}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginBottom: "16px"
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ color: "primary.main" }} />
            <Typography variant="h2" fontWeight={600} color="text.primary">
              Smart scheduling
            </Typography>
            <Switch
              checked={task.smartScheduling}
              onChange={(event) =>
                updateTask("smartScheduling", event.target.checked)
              }
              onMouseDown={(event) => event.preventDefault()}
            />
          </Box>

          <Collapse in={!task.smartScheduling} timeout={350}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: datetimeGap
              }}
            >
              <DateTimePicker
                label="Start datetime"
                taskState={{ task, updateTask }}
                datetimeErrorState={startDatetimeErrorState}
                props={{ minWidth: "250px" }}
              />
              <DateTimePicker
                label="End datetime"
                taskState={{ task, updateTask }}
                datetimeErrorState={endDatetimeErrorState}
                props={{ minWidth: "250px" }}
              />
            </Box>
          </Collapse>

          <Collapse in={task.smartScheduling} timeout={350}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: datetimeGap,
                  flexWrap: "wrap"
                }}
              >
                <DateTimePicker
                  label="Start date"
                  taskState={taskState}
                  datetimeErrorState={startDateErrorState}
                  props={{ minWidth: `${datetimeMinWidth}px` }}
                />
                <DateTimePicker
                  label="Due date"
                  taskState={taskState}
                  datetimeErrorState={dueDateErrorState}
                  props={{ minWidth: `${datetimeMinWidth}px` }}
                />
              </Box>
              <SchedulingHourSelector
                schedulingHours={schedulingHours}
                taskState={taskState}
              />
              <Box sx={{ display: "flex" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "auto",
                    gap: 0.5
                  }}
                >
                  <IconButton
                    onClick={() => setSplit((prev) => !prev)}
                    sx={{ padding: "4px" }}
                  >
                    {!split ? (
                      <CheckBoxOutlineBlankRoundedIcon
                        sx={{ color: "primary.main" }}
                      />
                    ) : (
                      <CheckBoxRoundedIcon sx={{ color: "primary.main" }} />
                    )}
                  </IconButton>
                  <Typography variant="h2" fontWeight={420}>
                    Split up
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <DurationInput
                  props={{
                    label: "Duration",
                    updateField: "duration",
                    split: split
                  }}
                  taskState={taskState}
                />
                <DurationInput
                  props={{
                    label: "Min duration",
                    updateField: "split",
                    split: split
                  }}
                  taskState={taskState}
                />
              </Box>
            </Box>
          </Collapse>
        </Box>
      </Collapse>
    </Box>
  )
}
