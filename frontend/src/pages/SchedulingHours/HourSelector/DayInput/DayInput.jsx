import HourInput from "./HourInput/HourInput"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

export default function DayInput({ day, schedulingHour, onErrorChange }) {
  const dayNameMapping = {
    0: "Monday",
    1: "Tuesday",
    2: "Wednesday",
    3: "Thursday",
    4: "Friday",
    5: "Saturday",
    6: "Sunday"
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        gap: 2
      }}
    >
      <Typography
        sx={{
          fontSize: "0.9rem",
          fontWeight: 600,
          width: "6.4rem",
          marginTop: "8px"
        }}
      >
        {dayNameMapping[day.dayIndex]}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 1,
          maxWidth: "340px"
        }}
      >
        {
          day.timeFrames.map((timeFrame) => (
            <HourInput
              key={timeFrame.id}
              timeFrame={timeFrame}
              schedulingHour={schedulingHour} 
              onErrorChange={onErrorChange}
              day={day} 
            />
          ))
        }
      </Box>
    </Box>
  )
}
