import { useState, useMemo } from "react"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import SvgIcon from "@mui/material/SvgIcon"

export default function PrioritySelector({ taskState, props }) {
  const { task, updateTask } = taskState
  const [bgColorValue, setBgColorValue] = useState("#FFFFFF")

  const handlePriorityChange = (event) => {
    updateTask("priority", event.target.value)
  }

  const bgColorMapping = {
    0: "grey.light",
    1: "green.light",
    2: "orange.light",
    3: "red.light"
  }

  const iconAndTextColorMapping = {
    0: "grey.main",
    1: "green.main",
    2: "orange.main",
    3: "red.main"
  }

  const bgColor = useMemo(() => bgColorMapping[task.priority], [task.priority])
  const iconAndTextColor = useMemo(
    () => iconAndTextColorMapping[task.priority],
    [task.priority]
  )

  const priorityIcon = () => {
    return (
      <SvgIcon
        sx={{
          color: iconAndTextColor,
          fontSize: "1rem"
        }}
      >
        <svg
          className="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z" />
        </svg>
      </SvgIcon>
    )
  }

  return (
    <FormControl sx={props}>
      <Select
        MenuProps={{
          PaperProps: {
            sx: {
              boxShadow:
                "0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.03),0px 3px 14px 2px rgba(0, 0, 0, 0.05)",
              px: "4px",
              margin: "8px 0",
              "& .MuiMenu-list": {
                py: "4px",
                display: "flex",
                flexDirection: "column",
                gap: 0.6
              },
              "& .MuiMenuItem-root": {
                maxHeight: "32px",
                minHeight: "32px",
                borderRadius: "4px",
                justifyContent: "center",
                "&:hover": {
                  fontWeight: 600
                }
              },
              "& .MuiMenuItem-root.Mui-selected": {
                fontWeight: 600,
                minWidth: "87px",
                color: iconAndTextColor,
                backgroundColor: bgColor,
                ":hover": {
                  backgroundColor: bgColor
                }
              }
            }
          }
        }}
        sx={{
          "& .MuiBackdrop-root-MuiModal-backdrop": {
            zIndex: "1500 !important"
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none"
          },
          "& .MuiOutlinedInput-input": {
            padding: "14px 8px 12px 4px !important"
          },
          backgroundColor: bgColorValue,
          flexDirection: "row-reverse",
          height: "40px",
          paddingLeft: "8px",
          minWidth: "100px",
          fontWeight: 600,
          cursor: "pointer",
          color: iconAndTextColor,
          border: "1px solid",
          borderColor: iconAndTextColor,
          "&:hover": {
            backgroundColor: bgColor
          },
          "@media (max-width: 400px)": {
            minWidth: "69px"
          }
        }}
        IconComponent={priorityIcon}
        value={task.priority}
        onOpen={() => {
          setBgColorValue(bgColor)
        }}
        onClose={() => {
          setBgColorValue("#FFFFFF")
        }}
        onChange={handlePriorityChange}
      >
        {["Low", "Medium", "High", "ASAP"].map((value, index) => (
          <MenuItem
            key={index}
            value={index}
            sx={{
              "&:hover, &:focus": {
                color: iconAndTextColorMapping[index],
                backgroundColor: bgColorMapping[index]
              }
            }}
          >
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
