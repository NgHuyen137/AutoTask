import { useState, useRef, useEffect } from "react"
import { styled } from "@mui/material/styles"
import {
  TaskName,
  TaskDescription
} from "~/components/TaskComponents/TextInput/TextInput"
import StatusSelector from "~/components/TaskComponents/StatusSelector/StatusSelector"
import { ExpandedTagsInput } from "~/components/TaskComponents/TagsInput/TagsInput"
import PrioritySelector from "~/components/TaskComponents/PrioritySelector/PrioritySelector"
import Box from "@mui/material/Box"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded"
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded"

const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "5px"
})

const StyledListItemTitle = styled(ListItemText)({
  color: "text.primary",
  marginTop: "2px",
  marginBottom: "0px",
  "& .MuiTypography-root": {
    fontWeight: 600,
    fontSize: "0.9rem"
  }
})

export default function TaskDetailsUpdate({
  taskSidebarRef,
  taskState,
  taskNameErrorState
}) {
  const [expand, setExpand] = useState(true)
  const taskDetailsUpdateRef = useRef(null)

  return (
    <Box
      ref={taskDetailsUpdateRef}
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "8px"
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
          Task details
        </Typography>
        <Typography
          sx={{
            fontSize: "0.9rem",
            gridColumn: "1"
          }}
        >
          Name, prioriy, & general settings
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
            flexDirection: "column",
            gap: 2
          }}
        >
          <StyledBox>
            <StyledListItemTitle>Task name</StyledListItemTitle>
            <TaskName
              taskState={taskState}
              taskNameErrorState={taskNameErrorState}
              props={{ height: "40px" }}
            />
          </StyledBox>

          <StyledBox>
            <StyledListItemTitle>Status</StyledListItemTitle>
            <StatusSelector
              taskState={taskState}
              props={{ maxWidth: "160px" }}
            />
          </StyledBox>

          <StyledBox>
            <StyledListItemTitle>Priority</StyledListItemTitle>
            <PrioritySelector
              taskState={taskState}
              props={{ maxWidth: "160px" }}
            />
          </StyledBox>

          <StyledBox>
            <StyledListItemTitle>Tags</StyledListItemTitle>
            <ExpandedTagsInput
              taskState={taskState}
              props={{
                popperWidth: `calc(${taskDetailsUpdateRef.current?.clientWidth}px - 32px)`
              }}
            />
          </StyledBox>

          <StyledBox>
            <StyledListItemTitle>Description</StyledListItemTitle>
            <TaskDescription taskState={taskState} />
          </StyledBox>
        </Box>
      </Collapse>
    </Box>
  )
}
