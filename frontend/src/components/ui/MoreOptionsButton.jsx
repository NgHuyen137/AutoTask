import { useState } from "react"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import MoreVertIcon from "@mui/icons-material/MoreVert"

export default function MoreOptionsButton({ openMoreOptions, onOpenMoreOptions }) {
  const [hoverMoreOptionsButton, setHoverMoreOptionsButton] = useState(false)

  return (
    <Tooltip
      arrow
      title="More options"
      open={!openMoreOptions && hoverMoreOptionsButton}
    >
      <IconButton
        onClick={onOpenMoreOptions}
        onMouseEnter={() => setHoverMoreOptionsButton(true)}
        onMouseLeave={() => setHoverMoreOptionsButton(false)}
        sx={{ padding: "4px" }}
      >
        <MoreVertIcon sx={{ fontSize: "1rem", color: "#8A8A8A" }} />
      </IconButton>
    </Tooltip>
  )
}
