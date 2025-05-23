import Box from "@mui/material/Box"
import OutlinedInput from "@mui/material/OutlinedInput"
import FormHelperText from "@mui/material/FormHelperText"

export const TaskName = ({
  taskNameErrorState,
  taskState,
  props,
  boxProps
}) => {
  const { task, updateTask } = taskState
  const { taskNameError, setTaskNameError } = taskNameErrorState

  const handleNameChange = (event) => {
    const newName = event.target.value
    if (newName.length === 0) setTaskNameError(true)
    else setTaskNameError(false)
    updateTask("name", newName)
  }

  return (
    <Box
      sx={{
        ...boxProps,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <OutlinedInput
        value={task.name}
        onChange={handleNameChange}
        id="task-name"
        placeholder="Task name..."
        error={taskNameError}
        sx={{ ...props, width: "100%" }}
      />
      {taskNameError && (
        <FormHelperText
          error={taskNameError}
          sx={{ alignSelf: "flex-start", marginLeft: "3px", marginRight: 0 }}
        >
          Task name is required
        </FormHelperText>
      )}
    </Box>
  )
}

export const TaskDescription = ({ taskState, props }) => {
  const { task, updateTask } = taskState

  return (
    <OutlinedInput
      multiline
      value={task.description}
      onChange={(event) => updateTask("description", event.target.value)}
      id="task-description"
      placeholder="Description..."
      sx={{
        ...props,
        alignItems: "flex-start",
        padding: "0 16px 9px 13px",
        "& .MuiOutlinedInput-input": {
          paddingTop: "10px"
        }
      }}
    />
  )
}
