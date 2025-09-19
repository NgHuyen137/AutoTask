import _ from "lodash"

import { useState, useRef } from "react"
import { useDeleteSchedulingHour, useUpdateSchedulingHour } from "~/hooks/useMutation"
import { useSchedulingHourContext } from "~/hooks/useContext"
import useDebounce from "~/hooks/useDebounce"
import { useClickOutsideMoreOptionsPopper } from "~/hooks/useEffect"
import { useEffectAfterMount } from "~/hooks/useEffect"
import { matchDaysOfWeek } from "~/utils/dataMapper"

import EditForm from "./EditForm/EditForm"
import EditButton from "~/components/ui/EditButton"
import DayInput from "./DayInput/DayInput"
import CustomDeleteDialog from "~/components/ui/CustomDeleteDialog"
import MoreOptionsButton from "~/components/ui/MoreOptionsButton"

import Box from "@mui/material/Box"
import Collapse from "@mui/material/Collapse"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded"
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded"
import Button from "@mui/material/Button"
import Popper from "@mui/material/Popper"
import Grow from "@mui/material/Grow"
import Paper from "@mui/material/Paper"
import SvgIcon from "@mui/material/SvgIcon"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"

export default function HourSelector({ schedulingHour }) {
  const [expand, setExpand] = useState(false)
  const [hasTimeError, setHasTimeError] = useState(false)
  const [openUpdateSchedulingHour, setOpenUpdateSchedulingHour] = useState(false)

  const moreOptionsAnchor = useRef(null)
  const moreOptionsPaperRef = useRef(null)
  const [openMoreOptions, setOpenMoreOptions] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const currSchedulingHour = useRef(schedulingHour)
  const debouncedSchedulingHour = useDebounce(schedulingHour, 3000)
  
  const {
    setOpenUpdateSuccessBar,
    setEnterUpdateSuccessBar,
    addDay,
    removeDay
  } = useSchedulingHourContext()

  const {
    updateSingleSchedulingHour,
    reset: resetUpdateSchedulingHour
  } = useUpdateSchedulingHour()

  const {
    deleteSingleSchedulingHour,
    isLoading: isDeletingSchedulingHour,
    isSuccess: deleteSchedulingHourSuccess,
    reset: resetDeleteSchedulingHour
  } = useDeleteSchedulingHour()

  useClickOutsideMoreOptionsPopper(
    moreOptionsAnchor,
    moreOptionsPaperRef,
    setOpenMoreOptions,
    openDeleteDialog
  )

  const handleDeleteSchedulingHour = () => {
    deleteSingleSchedulingHour(
      { id: schedulingHour.id },
      {
        onSuccess: () => setTimeout(() => resetDeleteSchedulingHour(), 3000)
      }
    )
  }

  const handleTimeErrorChange = (isError) => {
    setHasTimeError(isError)
  }

  useEffectAfterMount(() => {
    const hasChanges = !_.isEqual(
      currSchedulingHour.current.daysOfWeek.map(d => d.timeFrames.map(tf => ({ startTime: tf.startTime, endTime: tf.endTime }))),
      debouncedSchedulingHour.daysOfWeek.map(d => d.timeFrames.map(tf => ({ startTime: tf.startTime, endTime: tf.endTime })))
    )

    if (!hasTimeError && hasChanges) {
      const updatedSchedulingHourData = {
        days_of_week: matchDaysOfWeek(debouncedSchedulingHour.daysOfWeek)
      }

      updateSingleSchedulingHour(
        { 
          id: debouncedSchedulingHour.id, 
          updatedSchedulingHourData
        },
        {
          onSuccess: () => {
            currSchedulingHour.current = debouncedSchedulingHour
            setOpenUpdateSuccessBar(true)
            //setEnterUpdateSuccessBar(true)
            //setTimeout(() => setEnterUpdateSuccessBar(false), 1200)
            setTimeout(() => resetUpdateSchedulingHour(), 3000)
          }
        }
      )
    }
  }, [debouncedSchedulingHour.daysOfWeek])

  const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

  const handleDayClick = (dayId, isSelected) => {
    isSelected
      ? removeDay(schedulingHour.id, dayId)
      : addDay(schedulingHour.id, dayId)
  }

  const handleOpenUpdateForm = () => {
    setOpenUpdateSchedulingHour(true)
    setOpenMoreOptions(false)
  }

  const handleOpenMoreOptions = (event) => {
    moreOptionsAnchor.current = event.currentTarget
    setOpenMoreOptions((prev) => {
      if (prev === false) return true
      return false
    })
  }

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "auto 32px",
          alignItems: "center",
          transition: "margin-bottom 350ms ease-in-out",
          my: 2
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateRows: "auto auto"
          }}
        >
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              gridColumn: "1",
              color: expand ? "text.primary" : "primary.dark"
            }}
          >
            {schedulingHour.name}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.9rem",
              gridColumn: "1",
              color: "#69696B"
            }}
          >
            {schedulingHour.description}
          </Typography>
        </Box>
        
        <Box
          sx={{
            display: "grid",
            columnGap: 0.5,
            gridTemplateColumns: "repeat(3, auto)"
          }}
        >
          {
            !["Study", "Work"].includes(schedulingHour.name) &&
            (
              <EditButton 
                onEdit={handleOpenUpdateForm}
              />
            )
          }
          {
            openUpdateSchedulingHour &&
            (
              <EditForm 
                openUpdateSchedulingHourState={{ openUpdateSchedulingHour, setOpenUpdateSchedulingHour }}
                schedulingHour={schedulingHour}
              />
            )
          }

          {
            !["Study", "Work"].includes(schedulingHour.name) &&
            (
              <MoreOptionsButton openMoreOptions={openMoreOptions} onOpenMoreOptions={handleOpenMoreOptions} />
            )
          }
          <Popper
            disablePortal
            transition
            placement="left-end"
            open={openMoreOptions}
            anchorEl={moreOptionsAnchor.current}
            sx={{ zIndex: 1600 }}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps} timeout={350}>
                <Paper
                  ref={moreOptionsPaperRef}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "12px",
                    boxShadow:
                      "0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.03),0px 3px 14px 2px rgba(0, 0, 0, 0.05)"
                  }}
                >
                  <List
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      padding: 0
                    }}
                  >
                    <Button
                      onClick={handleOpenUpdateForm}
                      sx={{
                        textTransform: "none",
                        padding: 0,
                        borderRadius: "12px 12px 0 0",
                        color: "text.primary",
                        ":hover": {
                          backgroundColor: "#f5f5f5"
                        }
                      }}
                    >
                      <ListItem sx={{ padding: "2px 16px" }}>
                        <ListItemIcon sx={{ minWidth: "24px" }}>
                          <SvgIcon
                            sx={{ fontSize: "0.9rem", color: "#9e9e9e" }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="1em"
                              height="1em"
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
                        </ListItemIcon>
                        <ListItemText
                          sx={{
                            "& .MuiTypography-root": { fontSize: "0.8rem" }
                          }}
                        >
                          Edit
                        </ListItemText>
                      </ListItem>
                    </Button>
                    <Button
                      onClick={() => {
                        setOpenDeleteDialog(true)
                        setOpenMoreOptions(false)
                      }}
                      sx={{
                        textTransform: "none",
                        padding: 0,
                        borderRadius: "0 0 12px 12px",
                        color: "text.primary",
                        ":hover": {
                          backgroundColor: "#f5f5f5"
                        }
                      }}
                    >
                      <ListItem sx={{ padding: "2px 16px" }}>
                        <ListItemIcon sx={{ minWidth: "24px" }}>
                          <DeleteOutlinedIcon
                            sx={{ fontSize: "1rem", color: "#9e9e9e" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          sx={{
                            "& .MuiTypography-root": { fontSize: "0.8rem" }
                          }}
                        >
                          Delete
                        </ListItemText>
                      </ListItem>
                    </Button>
                  </List>
                </Paper>
              </Grow>
            )}
          </Popper>
          {openDeleteDialog && (
            <CustomDeleteDialog
              openDeleteDialogState={{
                openDeleteDialog,
                setOpenDeleteDialog
              }}
              name={schedulingHour.name}
              isDeleting={isDeletingSchedulingHour}
              isDeleted={deleteSchedulingHourSuccess}
              onDelete={handleDeleteSchedulingHour}
            />
          )}

          <IconButton
            onClick={() => setExpand(!expand)}
            sx={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              placeSelf: "center",
              color: "primary.dark"
            }}
          >
            {expand ? (
              <ExpandMoreRoundedIcon />
            ) : (
              <KeyboardArrowRightRoundedIcon />
            )}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expand} timeout={350}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 0.5
            }}
          >
            {Array.from({ length: 7 }, (_, i) => {
              const isSelected = schedulingHour.daysOfWeek.find(
                (day) => day.dayIndex === i
              )
              
              return (
                <Button
                  key={i}
                  variant="outlined"
                  sx={{
                    width: 36,
                    height: 36,
                    minWidth: 0,
                    padding: 0,
                    "&:hover": {
                      backgroundColor: isSelected ? "primary.dark" : "grey.100"
                    },
                    color: isSelected ? "white" : "black",
                    backgroundColor: isSelected ? "primary.main" : "white",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    borderColor: "grey.300",
                    borderRadius: "50%"
                  }}
                  onClick={() => handleDayClick(i, isSelected)}
                >
                  {dayNames[i]}
                </Button>
              )
            })}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginBottom: 4,
              gap: 2
            }}
          >
            {schedulingHour.daysOfWeek.map((day) => (
              <DayInput
                key={day.dayIndex}
                day={day}
                schedulingHour={schedulingHour}
                onErrorChange={handleTimeErrorChange}
              />
            ))}
          </Box>
        </Box>
      </Collapse>
    </>
  )
}
