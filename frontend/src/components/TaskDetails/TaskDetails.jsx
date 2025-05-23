import { useLayoutEffect, useRef, useState } from "react"
import { usePlannerContext } from "~/hooks/useContext"
import { useScreenSize } from "~/hooks/useEffect"
import { useFetchAllSchedulingHours } from "~/hooks/useQuery"
import { styled } from "@mui/material/styles"
import { getStrTimeBlock, getStrDatetime } from "~/utils/datetime"
import Box from "@mui/material/Box"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import IconButton from "@mui/material/IconButton"
import Collapse from "@mui/material/Collapse"
import SvgIcon from "@mui/material/SvgIcon"
import CircleIcon from "@mui/icons-material/Circle"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined"
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined"
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded"
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded"

const StyledListItemIcon = styled(ListItemIcon)({
  minWidth: "26px"
})

const StyledListItemTitle = styled(ListItemText)(({ props }) => ({
  color: props?.color || "#8a8a8a",
  marginTop: "2px",
  marginBottom: "0px",
  "& .MuiTypography-root": {
    fontSize: props?.fontSize || "0.9rem",
    fontWeight: props?.fontWeight || 400
  }
}))

const StyledListItemContent = styled(ListItemText)(({ props }) => ({
  marginTop: "2px",
  marginBottom: "0px",
  maxWidth: props?.maxWidth || "auto",
  "& .MuiTypography-root": {
    fontWeight: 540
  }
}))

const bgColorMapping = {
  0: "grey.light",
  1: "green.light",
  2: "orange.light",
  3: "red.light"
}

const textColorMapping = {
  0: "grey.main",
  1: "green.main",
  2: "orange.main",
  3: "red.main"
}

const priorityNumToText = {
  0: "Low",
  1: "Medium",
  2: "High",
  3: "ASAP"
}

const statusNumToText = {
  0: "Not Completed",
  1: "Completed"
}

export default function TaskDetails({ taskSidebarRef }) {
  const { targetTask, taskSidebarWidth } = usePlannerContext()
  const { startAt, endAt, name, status, priority, tags, description } =
    targetTask
  const stackRef = useRef(null)
  const stackContainerRef = useRef(null)
  const [stackWidth, setStackWidth] = useState(0)
  const [stackContainerWidth, setStackContainerWidth] = useState(0)
  const [expand, setExpand] = useState(false) // Expand Scheduling Details

  const responsiveThreshold = 372

  const schedulingHours = useFetchAllSchedulingHours()

  useLayoutEffect(() => {
    if (stackRef.current) setStackWidth(stackRef.current.scrollWidth)

    if (stackContainerRef.current)
      setStackContainerWidth(stackContainerRef.current.clientWidth)
  })

  return (
    <Box sx={{ padding: "0 32px" }}>
      <List
        sx={{
          padding: 0
        }}
      >
        <ListItem>
          <Typography variant="h1" fontWeight={600} color="text.primary">
            {name}
          </Typography>
        </ListItem>

        <ListItem>
          <Box
            sx={{
              width: "100%",
              maxWidth: "400px",
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: "8px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 0 4px 0px rgba(187, 187, 237, 0.3)"
            }}
          >
            <StyledListItemIcon>
              <CalendarTodayIcon
                sx={{ color: "primary.dark", fontSize: "1rem" }}
              />
            </StyledListItemIcon>
            <Typography variant="body1" color="#8a8a8a" fontWeight={500}>
              {getStrTimeBlock(startAt, endAt)}
            </Typography>
          </Box>
        </ListItem>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <List>
            <Box
              sx={{
                display: "flex",
                flexDirection:
                  taskSidebarWidth < responsiveThreshold ? "column" : "row"
              }}
            >
              <ListItem
                sx={{
                  maxWidth: "143px",
                  minWidth: "143px",
                  paddingBottom: taskSidebarWidth < responsiveThreshold ? 0 : 1
                }}
              >
                <StyledListItemIcon>
                  <CheckCircleOutlineOutlinedIcon
                    sx={{ color: "#8a8a8a", fontSize: "1.1rem" }}
                  />
                </StyledListItemIcon>
                <StyledListItemTitle>Status</StyledListItemTitle>
              </ListItem>
              <ListItem
                sx={{
                  gap: 1,
                  alignItems: "center",
                  paddingTop: taskSidebarWidth < responsiveThreshold ? "4px" : 1
                }}
              >
                <StyledListItemContent props={{ maxWidth: "fit-content" }}>
                  {statusNumToText[status]}
                </StyledListItemContent>
                <StyledListItemIcon sx={{ alignItems: "center" }}>
                  <CircleIcon
                    fontSize="13px"
                    color={
                      statusNumToText[status] === "Not Completed"
                        ? "red"
                        : "green"
                    }
                  />
                </StyledListItemIcon>
              </ListItem>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection:
                  taskSidebarWidth < responsiveThreshold ? "column" : "row"
              }}
            >
              <ListItem
                sx={{
                  maxWidth: "143px",
                  minWidth: "143px",
                  paddingBottom: taskSidebarWidth < responsiveThreshold ? 0 : 1
                }}
              >
                <StyledListItemIcon>
                  <SvgIcon sx={{ color: "#8a8a8a", fontSize: "1rem" }}>
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
                </StyledListItemIcon>
                <StyledListItemTitle>Priority</StyledListItemTitle>
              </ListItem>
              <ListItem sx={{ padding: "6px 8px 8px" }}>
                <Box
                  sx={{
                    width: "80px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    color: textColorMapping[priority],
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: textColorMapping[priority],
                    backgroundColor: bgColorMapping[priority]
                  }}
                >
                  <StyledListItemContent
                    sx={{
                      textAlign: "center",
                      margin: "4px"
                    }}
                  >
                    {priorityNumToText[priority]}
                  </StyledListItemContent>
                </Box>
              </ListItem>
            </Box>

            {tags.length !== 0 && (
              <Box
                ref={stackContainerRef}
                sx={{
                  display: "flex",
                  flexDirection:
                    taskSidebarWidth < responsiveThreshold ? "column" : "row",
                  flexWrap:
                    stackWidth > stackContainerWidth - 143 ? "wrap" : "nowrap"
                }}
              >
                <ListItem
                  sx={{
                    maxWidth: "143px",
                    minWidth: "143px",
                    paddingBottom:
                      taskSidebarWidth < responsiveThreshold ? 0 : 1
                  }}
                >
                  <StyledListItemIcon>
                    <LocalOfferOutlinedIcon
                      sx={{ color: "#8a8a8a", fontSize: "1.1rem" }}
                    />
                  </StyledListItemIcon>
                  <StyledListItemTitle>Tags</StyledListItemTitle>
                </ListItem>
                <ListItem>
                  <Stack
                    ref={stackRef}
                    direction="row"
                    sx={{
                      flexWrap:
                        stackWidth > stackContainerWidth - 143
                          ? "wrap"
                          : "nowrap",
                      rowGap: "8px",
                      gap: "8px",
                      overflow: "hidden"
                    }}
                  >
                    {tags.map((option, index) => (
                      <Chip
                        key={index}
                        label={option.name}
                        sx={{
                          borderRadius: "8px",
                          fontWeight: 540,
                          backgroundColor: "#e1e9f0"
                        }}
                      />
                    ))}
                  </Stack>
                </ListItem>
              </Box>
            )}

            {targetTask.startDate &&
              targetTask.dueDate &&
              String(targetTask.startDate?.$d) !== "Invalid Date" &&
              String(targetTask.dueDate?.$d) !== "Invalid Date" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    <ListItem sx={{ maxWidth: "143px", minWidth: "143px" }}>
                      <StyledListItemIcon>
                        <AccessTimeIcon
                          sx={{ color: "#8a8a8a", fontSize: "1.1rem" }}
                        />
                      </StyledListItemIcon>
                      <StyledListItemTitle>Scheduling</StyledListItemTitle>
                    </ListItem>
                    <ListItem>
                      <IconButton
                        onClick={() => setExpand(!expand)}
                        sx={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%"
                        }}
                      >
                        {expand ? (
                          <ExpandLessRoundedIcon />
                        ) : (
                          <ExpandMoreRoundedIcon />
                        )}
                      </IconButton>
                    </ListItem>
                  </Box>

                  <Collapse in={expand} timeout={350}>
                    <Box
                      sx={{
                        margin: "0 8px 8px 8px",
                        borderRadius: "8px",
                        border: "3px dashed #E1E9F0"
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            taskSidebarWidth < 430 ? "flex-start" : "center",
                          flexDirection:
                            taskSidebarWidth < 430 ? "column" : "row"
                        }}
                      >
                        <ListItem
                          sx={{
                            maxWidth: "143px",
                            padding:
                              taskSidebarWidth < 430
                                ? "6px 23px 2px 23px"
                                : "6px 23px 0 23px"
                          }}
                        >
                          <StyledListItemTitle
                            props={{
                              color: "text.primary",
                              fontSize: "0.8rem",
                              fontWeight: 600
                            }}
                          >
                            Start
                          </StyledListItemTitle>
                        </ListItem>
                        <ListItem
                          sx={{
                            paddingBottom: taskSidebarWidth < 430 ? 1 : 0,
                            paddingLeft: taskSidebarWidth < 430 ? "23px" : 0,
                            paddingTop: taskSidebarWidth < 430 ? 0 : 1
                          }}
                        >
                          <Typography
                            fontSize="0.8rem"
                            color="#8A8A9A"
                            fontWeight={500}
                          >
                            {getStrDatetime(targetTask.startDate)}
                          </Typography>
                        </ListItem>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            taskSidebarWidth < 430 ? "flex-start" : "center",
                          flexDirection:
                            taskSidebarWidth < 430 ? "column" : "row"
                        }}
                      >
                        <ListItem
                          sx={{
                            maxWidth: "143px",
                            padding: "0 23px 2px 23px"
                          }}
                        >
                          <StyledListItemTitle
                            props={{
                              color: "text.primary",
                              fontSize: "0.8rem",
                              fontWeight: 600
                            }}
                          >
                            Due
                          </StyledListItemTitle>
                        </ListItem>
                        <ListItem
                          sx={{
                            paddingLeft: taskSidebarWidth < 430 ? "23px" : 0,
                            paddingTop: taskSidebarWidth < 430 ? 0 : 1
                          }}
                        >
                          <Typography
                            fontSize="0.8rem"
                            color="#8A8A9A"
                            fontWeight={500}
                          >
                            {getStrDatetime(targetTask.dueDate)}
                          </Typography>
                        </ListItem>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            taskSidebarWidth < 430 ? "flex-start" : "center",
                          flexDirection:
                            taskSidebarWidth < 430 ? "column" : "row"
                        }}
                      >
                        <ListItem
                          sx={{
                            maxWidth: "143px",
                            padding:
                              taskSidebarWidth < 430
                                ? "0 23px 2px 23px"
                                : "0 23px 8px 23px"
                          }}
                        >
                          <StyledListItemTitle
                            props={{
                              color: "text.primary",
                              fontSize: "0.8rem",
                              fontWeight: 600
                            }}
                          >
                            Idea time
                          </StyledListItemTitle>
                        </ListItem>
                        <ListItem
                          sx={{
                            paddingLeft: taskSidebarWidth < 430 ? "23px" : 0,
                            paddingTop: 0
                          }}
                        >
                          <Typography
                            fontSize="0.8rem"
                            color="#8A8A9A"
                            fontWeight={500}
                          >
                            {
                              schedulingHours.find(
                                (schedulingHour) =>
                                  schedulingHour._id ===
                                  targetTask.schedulingHour
                              ).name
                            }
                          </Typography>
                        </ListItem>
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              )}

            <Box>
              <ListItem
                sx={{
                  paddingBottom: 0
                }}
              >
                <StyledListItemIcon>
                  <DescriptionOutlinedIcon
                    sx={{ color: "#8a8a8a", fontSize: "1.1rem" }}
                  />
                </StyledListItemIcon>
                <StyledListItemTitle>Description</StyledListItemTitle>
              </ListItem>
              <ListItem>
                <Box
                  sx={{
                    height: "80px",
                    width: "100%",
                    padding: "8px 16px",
                    backgroundColor: "#ebedf0",
                    borderRadius: "12px"
                  }}
                >
                  <Typography
                    variant="body1"
                    color={description ? "text.primary" : "#8a8e99"}
                  >
                    {description ? description : "Empty"}
                  </Typography>
                </Box>
              </ListItem>
            </Box>
          </List>
        </Box>
      </List>
    </Box>
  )
}
