import { useState, useRef } from "react"

import CheckBox from "~/components/ui/CheckBox"
import DateRangeCalendar from "~/components/ui/DateRangeCalendar"
import MultipleInputs from "~/components/ui/MultipleInputs"

import Box from "@mui/material/Box"
import Popper from "@mui/material/Popper"
import Grow from "@mui/material/Grow"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded"
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded"

const FilterField = ({ displayName, props, children }) => {
  const [openMenu, setOpenMenu] = useState(false)

  const handleMenuClick = () => {
    setOpenMenu((prev) => !prev)
  }

  return (
    <Box
      sx={{
        border: openMenu ? "2px solid #d7e3fc" : "none",
        borderRadius: openMenu ? "4px" : "none"
      }}
    >
      <Box
        sx={{
          py: 0.6,
          px: 1.2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "4px",
          backgroundColor: openMenu ? "#FFF" : "background.paper",
          "&:hover": {
            backgroundColor: openMenu ? "#FFF" : "#d7e3fc"
          },
          cursor: "pointer"
        }}
        onClick={handleMenuClick}
      >
        <Typography sx={{ fontWeight: 500 }}>{displayName}</Typography>
        {openMenu ? (
          <ArrowDropUpRoundedIcon sx={{ color: "#747577" }} />
        ) : (
          <ArrowDropDownRoundedIcon sx={{ color: "#747577" }} />
        )}
      </Box>
      {openMenu && (
        <Box
          sx={{
            ...props,
            py: 1,
            px: 1.2,
            display: "flex",
            flexDirection: "column"
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  )
}

export default function FilterMenu({
  filterAnchorEl,
  filters,
  updateFilters,
  clearFilters,
  updateParams,
  onFilterMenuClose
}) {
  const filterMenuRef = useRef(null)
  const [dateRange, setDateRange] = useState([null, null])

  const handleFilterSave = () => {
    updateParams(filters)
    onFilterMenuClose()
  }

  const handleFilterClear = () => {
    clearFilters()
  }

  const handleCheckBoxClick = (field, choice) => {
    updateFilters(field, choice)
  }

  const handleDateRangeChange = (value) => {
    setDateRange(value)
    updateFilters("from_date", value[0])
    updateFilters("to_date", value[1])
  }

  const handleTagInputAdd = (newTagInputs) => {
    updateFilters("tags", newTagInputs)
  }

  const statusOptions = [
    { label: "Done", value: 1 },
    { label: "Not Done", value: 0 }
  ]

  const priorityOptions = [
    { label: "Low", value: 0 },
    { label: "Medium", value: 1 },
    { label: "High", value: 2 },
    { label: "ASAP", value: 3 }
  ]

  const dateTypeOptions = [
    { label: "Start date", value: "start_date" },
    { label: "Due date", value: "due_date" }
  ]

  return (
    <Popper
      sx={(theme) => ({ zIndex: theme.zIndex.tooltip })}
      open={Boolean(filterAnchorEl)}
      anchorEl={filterAnchorEl}
      placement="bottom-start"
      transition
      onMouseDown={(event) => event.stopPropagation()}
      modifiers={[
        {
          name: "preventOverflow",
          options: {
            padding: 16 // keeps 16px space from viewport edges
          }
        }
      ]}
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          timeout={350}
          style={{
            transformOrigin:
              {
                bottom: "top center",
                "bottom-start": "top left",
                "bottom-end": "top right",
                top: "bottom center",
                "top-start": "bottom left",
                "top-end": "bottom right",
                left: "center right",
                right: "center left"
              }[placement] || "top left"
          }}
        >
          <Paper
            ref={filterMenuRef}
            sx={{
              mt: 1,
              px: 2,
              paddingTop: 1,
              paddingBottom: 2,
              width: "300px",
              maxHeight: "450px",
              borderRadius: "8px",
              overflowY: "auto",
              boxShadow:
                "0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.03),0px 3px 14px 2px rgba(0, 0, 0, 0.05)"
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Typography sx={{ fontWeight: 510, fontSize: "0.9rem" }}>
                Filter Tasks
              </Typography>
              <ButtonGroup
                variant="text"
                aria-label="Basic button group"
                sx={{
                  "& .MuiButton-root": {
                    fontSize: "0.8rem",
                    color: "primary.main",
                    textTransform: "none"
                  },
                  "& .MuiButtonGroup-grouped:not(:last-of-type)": {
                    borderRight: "1px solid rgba(0,0,0,0.2)",
                    marginRight: "-1px",
                    // 👇 make line shorter
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      right: -1,
                      top: "25%", // adjust start point
                      bottom: "25%", // adjust end point
                      width: "1px",
                      backgroundColor: "rgba(0,0,0,0.2)"
                    },
                    borderRight: "none"
                  }
                }}
              >
                <Tooltip arrow title="Clear all filters">
                  <Button onClick={handleFilterClear}>Clear</Button>
                </Tooltip>
                <Tooltip arrow title="Apply filters">
                  <Button onClick={handleFilterSave}>Save</Button>
                </Tooltip>
              </ButtonGroup>
            </Box>

            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 0.8 }}
            >
              <FilterField displayName="Tags">
                <MultipleInputs
                  inputs={filters.tags}
                  onInputAdd={handleTagInputAdd}
                />
              </FilterField>

              <FilterField displayName="Status">
                {statusOptions.map((option, index) => (
                  <CheckBox
                    key={index}
                    fieldName="status"
                    option={option}
                    selected={filters.status}
                    onCheckBoxClick={handleCheckBoxClick}
                  />
                ))}
              </FilterField>

              <FilterField displayName="Priority">
                {priorityOptions.map((option, index) => (
                  <CheckBox
                    key={index}
                    fieldName="priority"
                    option={option}
                    selected={filters.priority}
                    onCheckBoxClick={handleCheckBoxClick}
                  />
                ))}
              </FilterField>

              <FilterField displayName="Time" props={{ gap: 1 }}>
                <FilterField displayName="Date type">
                  {dateTypeOptions.map((option, index) => (
                    <CheckBox
                      key={index}
                      fieldName="range_type"
                      option={option}
                      selected={filters.range_type}
                      onCheckBoxClick={handleCheckBoxClick}
                    />
                  ))}
                </FilterField>
                <Box sx={{ alignSelf: "center", justifySelf: "center" }}>
                  <DateRangeCalendar
                    dateRange={dateRange}
                    onDateRangeChange={handleDateRangeChange}
                  />
                </Box>
              </FilterField>
            </Box>
          </Paper>
        </Grow>
      )}
    </Popper>
  )
}
