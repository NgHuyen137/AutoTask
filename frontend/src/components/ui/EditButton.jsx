import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import SvgIcon from "@mui/material/SvgIcon"

export default function EditButton({ props, onEdit }) {
  return (
    <Tooltip arrow title="Edit">
      <IconButton
        onClick={onEdit}
        sx={{ ...props, padding: "4px" }}
      >
        <SvgIcon sx={{ fontSize: "1rem", color: "#8A8A8A" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="0.9em"
            height="0.9em"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
            ></path>
          </svg>
        </SvgIcon>
      </IconButton>
    </Tooltip>
  )
}
