import { useState } from "react"
import CustomSubmitButton from "~/components/ui/CustomSubmitButton"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import OutlinedInput from "@mui/material/OutlinedInput"
import FormHelperText from "@mui/material/FormHelperText"
import { useUpdateSchedulingHour } from "~/hooks/useMutation"

export default function EditForm({ openUpdateSchedulingHourState, schedulingHour }) {
  const [name, setName] = useState(schedulingHour.name || "")
  const [description, setDescription] = useState(schedulingHour.description || "")
  const [hourNameError, setHourNameError] = useState(false)
  const { openUpdateSchedulingHour, setOpenUpdateSchedulingHour } = openUpdateSchedulingHourState
  
  const {
    updateSingleSchedulingHour,
    isLoading: isUpdatingSchedulingHour,
    isSuccess: updateSchedulingHourSuccess,
    reset: resetUpdateSchedulingHour
  } = useUpdateSchedulingHour()

  const handleHourNameChange = (event) => {
    const newName = event.target.value
    if (newName.length === 0)
      setHourNameError(true)
    else
      setHourNameError(false)
    setName(newName)
  }

  const handleHourDescriptionChange = (event) => {
    const newDescription = event.target.value
    setDescription(newDescription)
  }

  const handleUpdateCustomHours = () => {
    const updatedSchedulingHourData = {
      name,
      description
    }

    updateSingleSchedulingHour(
      {
        id: schedulingHour.id,
        updatedSchedulingHourData
      },
      {
        onSuccess: () => {
          setTimeout(() => resetUpdateSchedulingHour(), 3000)
        }
      }
    )
  }

  return (
    <Dialog
      open={openUpdateSchedulingHour}
      slotProps={{
        paper: {
          sx: {
            minWidth: {
              "xs": "calc(100vw - 32px)",
              "sm": "400px"
            }, 
            borderRadius: "12px"
          }
        }
      }}
    >
      <DialogContent
        sx={{
          paddingBottom: 0
        }}
      >
        <Box 
          component="form" 
          sx={{ 
            display: "flex", 
            flexDirection: "column",
            gap: 2
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>Update hours</Typography>
            <Typography>
              Update scheduling hour's name and description
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, marginBottom: 0.5 }}>Name</Typography>
            <OutlinedInput
              value={name}
              onChange={handleHourNameChange}
              id="hour-name"
              placeholder="Enter a title for your Custom Hours"
              error={hourNameError}
              sx={{ 
                width: "100%",
                padding: "0 16px 9px 13px",
                "& .MuiOutlinedInput-input": {
                  padding: "10px 0 0"
                }
              }}
            />
            {hourNameError && (
              <FormHelperText
                error={hourNameError}
                sx={{ alignSelf: "flex-start", marginLeft: "3px", marginRight: 0 }}
              >
                Hour's name is required
              </FormHelperText>
            )}
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, marginBottom: 0.5 }}>Description</Typography>
            <OutlinedInput
              multiline
              value={description}
              onChange={handleHourDescriptionChange}
              id="hour-description"
              placeholder="Enter a description for your Custom Hours"
              sx={{
                width: "100%",
                padding: "0 16px 9px 13px",
                "& .MuiOutlinedInput-input": {
                  paddingTop: "10px",
                  minHeight: "60px"
                }
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "flex-start",
          padding: "24px 24px 20px"
        }}
      >
        <CustomSubmitButton
          buttonName="Save"
          handleClick={handleUpdateCustomHours}
          isLoading={isUpdatingSchedulingHour}
          isSuccess={updateSchedulingHourSuccess}
          props={{ height: "36px" }}
        />
        <CustomSubmitButton
          buttonName="Cancel"
          handleClick={() => {
            setOpenUpdateSchedulingHour(false)
          }}
          props={{
            height: "36px",
            color: "primary.dark",
            boxShadow: "none !important",
            backgroundColor: "#FFF",
            ":hover": {
              boxShadow: "none !important",
              backgroundColor: "#e5edff !important"
            }
          }}
        />
      </DialogActions>
    </Dialog>
  )
}
