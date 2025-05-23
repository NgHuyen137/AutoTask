import { useEffect } from "react"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import Box from "@mui/material/Box"
import InputLabel from "@mui/material/InputLabel"
import Typography from "@mui/material/Typography"
import MenuItem from "@mui/material/MenuItem"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"

const useDefaultSchedulingHour = (task, updateTask) => {
  // Set default Scheduling Hour to Active Hours
  useEffect(() => {
    if (task.smartScheduling && !task.schedulingHour)
      updateTask("schedulingHour", "67c4a91afce6984b9a6da6cd")
    if (!task.smartScheduling && task.schedulingHour)
      updateTask("schedulingHour", null)
  }, [task.smartScheduling])
}

export default function SchedulingHourSelector({ schedulingHours, taskState }) {
  const { task, updateTask } = taskState

  useDefaultSchedulingHour(task, updateTask)

  return (
    <FormControl>
      <InputLabel sx={{ marginTop: "14px" }}>Hours</InputLabel>
      <Select
        value={
          task.schedulingHour ? task.schedulingHour : "67c4a91afce6984b9a6da6cd"
        }
        onChange={(event) => updateTask("schedulingHour", event.target.value)}
        onMouseDown={(e) => e.stopPropagation()}
        renderValue={(value) => {
          const selectedHour = schedulingHours?.find(
            (hour) => hour._id === value
          )
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <InfoOutlinedIcon
                sx={{ fontSize: "1.1rem", color: "primary.main" }}
              />
              <Typography sx={{ fontSize: "0.9rem" }}>
                {selectedHour?.name}
              </Typography>
            </Box>
          )
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              px: "4px",
              margin: "8px 0",
              boxShadow:
                "0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.03),0px 3px 14px 2px rgba(0, 0, 0, 0.05)",
              "& .MuiMenu-list": {
                py: "4px",
                display: "flex",
                flexDirection: "column",
                gap: 0.6
              },
              "& .MuiMenuItem-root": {
                borderRadius: "4px",
                minHeight: "32px"
              },
              "& .MuiMenuItem-root.Mui-selected": {
                backgroundColor: "#F2F6FF"
              },
              "& .MuiMenuItem-root.Mui-selected:hover": {
                backgroundColor: "#d9e5ff"
              }
            }
          }
        }}
        sx={{
          "& .MuiOutlinedInput-input": {
            padding: "24px 14px 8px 14px"
          },
          maxWidth: "340px"
        }}
      >
        {schedulingHours?.map((schedulingHour) => (
          <MenuItem key={schedulingHour._id} value={schedulingHour._id}>
            {schedulingHour.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
