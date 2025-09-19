import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

import { nanoid } from "nanoid"
import React, { useState, useEffect, useRef } from "react"
import { useFetchAllSchedulingHours } from "~/hooks/useQuery"
import { 
  useCreateNewSchedulingHour
} from "~/hooks/useMutation"
import { useSchedulingHourState } from "~/hooks/useState"
import { useSchedulingHourContext } from "~/hooks/useContext"
import { matchSchedulingHour } from "~/utils/dataMapper"

import AppBar from "~/components/AppBar/AppBar"
import SideBar from "~/components/SideBar/SideBar"
import MainContainer from "~/components/MainContainer/MainContainer"
import HourSelector from "./HourSelector/HourSelector"
import CustomSubmitButton from "~/components/ui/CustomSubmitButton"

import Box from "@mui/material/Box"
import Slide from "@mui/material/Slide"
import Snackbar from "@mui/material/Snackbar"
import Divider from "@mui/material/Divider"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import OutlinedInput from "@mui/material/OutlinedInput"
import FormHelperText from "@mui/material/FormHelperText"
import AddRoundedIcon from "@mui/icons-material/AddRounded"

export default function SchedulingHours() {
  const menuButtonRef = useRef(null)
  const taskCreateFormRef = useRef(null)

  const [openCreateCustomHours, setOpenCreateCustomHours] = useState(false)
  const [hourNameError, setHourNameError] = useState(false)

  // Manage the state of scheduling hours
  const { 
    schedulingHour, 
    updateSchedulingHour,
    resetSchedulingHourState
  } = useSchedulingHourState()

  const { 
    schedulingHours, 
    setSchedulingHours,
    doneFetchingSchedulingHours, 
    setDoneFetchingSchedulingHours,
    openUpdateSuccessBar, 
    setOpenUpdateSuccessBar,
    enterUpdateSuccessBar,
    setEnterUpdateSuccessBar
  } = useSchedulingHourContext()

  // Fetch all scheduling hours
  const schedulingHoursData = useFetchAllSchedulingHours()

  const {
    createNewSchedulingHour,
    isLoading: isCreatingSchedulingHour,
    isSuccess: createSchedulingHourSuccess,
    reset: resetCreateSchedulingHour
  } = useCreateNewSchedulingHour()

  useEffect(() => {
    if (schedulingHoursData) {
      // Map the fetched data to the desired format
      const formattedSchedulingHoursData = schedulingHoursData.map((schedulingHour) => ({
        id: schedulingHour["_id"],
        name: schedulingHour["name"],
        description: schedulingHour["description"],
        daysOfWeek: schedulingHour["days_of_week"].map((day) => ({
          dayIndex: day["day_index"],
          timeFrames: day["time_frames"].map((timeFrame) => ({
            id: nanoid(),
            startTime: dayjs.utc(timeFrame["start_at"]).add(7, "hour").format("h:mm a"),
            endTime: dayjs.utc(timeFrame["end_at"]).add(7, "hour").format("h:mm a")
          }))
        }))
      }))
  
      // Update the state with the formatted data
      setSchedulingHours(formattedSchedulingHoursData)

      if (!doneFetchingSchedulingHours) {
        setTimeout(() => setDoneFetchingSchedulingHours(true), 3000)
      }
    }
  }, [schedulingHoursData])

  const handleHourNameChange = (event) => {
    const newName = event.target.value
    if (newName.length === 0)
      setHourNameError(true)
    else
      setHourNameError(false)
    updateSchedulingHour("name", newName)
  }

  const handleCreateCustomHours = () => {
    if (hourNameError || schedulingHour.name.length === 0) {
      setHourNameError(true)
      return
    }
    
    const matchedSchedulingHour = matchSchedulingHour(schedulingHour)
    createNewSchedulingHour(matchedSchedulingHour)
    resetSchedulingHourState()
    setTimeout(() => resetCreateSchedulingHour(), 3000)
  }

  const SlideTransition = (props) => {
    return <Slide {...props} direction="up" />
  }

  // const SlideTransition = React.forwardRef(function SlideTransition(props, ref) {
  //   return <Slide direction="up" ref={ref} {...props} />
  // })

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: "100vh", display: "flex", overflow: "hidden" }}
    >
      <SideBar />
      <MainContainer>
        <AppBar 
          appBarName="Hours"
          menuButtonRef={menuButtonRef}
          taskCreateFormRef={taskCreateFormRef}
        />
        <Box 
          sx={{ 
            maxHeight: "calc(100vh - 56px)",
            padding: 5,
            overflowY: "auto"
          }}
        >
          <Box
            sx={{
              mx: "auto",
              maxWidth: "40rem"
            }}
          >
            <Box sx={{ marginBottom: 5 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 600 }}>Hours</Typography>
              {schedulingHours.map((schedulingHour) => (
                <React.Fragment key={schedulingHour.id}>
                  <HourSelector
                    schedulingHour={schedulingHour}
                  />
                  <Divider sx={{ color: "#E5E6E9" }} />
                </React.Fragment>
              ))}
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 1 }}>Custom Hours</Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddRoundedIcon />}
                sx={{
                  textTransform: "none",
                  fontSize: "0.8rem",
                  fontWeight: 510,
                  color: "white",
                  backgroundColor: "primary.main",
                  padding: "6px 8px",
                  borderRadius: "16px",
                  boxShadow: "none",
                  "& .MuiButton-startIcon": {
                    marginRight: "4px"
                  },
                  "&:hover": {
                    boxShadow: "none",
                    backgroundColor: "primary.dark"
                  }
                }}
                onClick={() => setOpenCreateCustomHours(true)}
              >
                Custom Hours
              </Button>
              <Dialog
                open={openCreateCustomHours}
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
                      <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>New hours</Typography>
                      <Typography>
                        Enter a name and short description for your Custom Hours
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, marginBottom: 0.5 }}>Name</Typography>
                      <OutlinedInput
                        value={schedulingHour.name}
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
                        value={schedulingHour.description}
                        onChange={(event) => updateSchedulingHour("description", event.target.value)}
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
                    buttonName="Create"
                    handleClick={handleCreateCustomHours}
                    isLoading={isCreatingSchedulingHour}
                    isSuccess={createSchedulingHourSuccess}
                    props={{ height: "36px" }}
                  />
                  <CustomSubmitButton
                    buttonName="Cancel"
                    handleClick={() => {
                      setOpenCreateCustomHours(false)
                      resetSchedulingHourState()
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
            </Box>
          </Box>
        </Box>
        <Snackbar
          open={openUpdateSuccessBar}
          autoHideDuration={1200}
          onClose={() => setOpenUpdateSuccessBar(false)}
          message="Hours have been saved!"
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          TransitionComponent={SlideTransition}
          //TransitionProps={{ unmountOnExit: true }}
          // TransitionComponent={(props) => 
          //   <Slide 
          //     {...props} 
          //     direction="up" 
          //     mountOnEnter 
          //     unmountOnExit
          //     in={enterUpdateSuccessBar}
          //     onExited={() => setOpenUpdateSuccessBar(false)}
          //   />
          // }
          sx={{ 
            "& .MuiSnackbarContent-root": {
              justifyContent: "center",
              minWidth: "200px",
              maxWidth: "200px"
            },
            "& .MuiSnackbarContent-message": {
              fontSize: "0.8rem",
              fontWeight: 500
            }
          }}
        />
      </MainContainer>
    </Container>
  )
}
