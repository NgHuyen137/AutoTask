import { useState } from "react"

import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded"

export default function SortButton({ updateParams }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const openSortMenu = Boolean(anchorEl)
  const [sortField, setSortField] = useState("due_date")

  const handleSortFieldSelect = (value) => {
    setSortField(value)
    updateParams({ sort_by: value })
  }

  const handleShowSortMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleSortMenuClose = () => {
    setAnchorEl(null)
  }

  const sortOptions = [
    { label: "Status", value: "status" },
    { label: "Priority", value: "priority" },
    { label: "Start date", value: "start_date" },
    { label: "Due date", value: "due_date" }
  ]

  return (
    <>
      <Button
        onClick={handleShowSortMenu}
        startIcon={
          <SwapVertRoundedIcon sx={{ fontSize: "1rem", color: "#747577" }} />
        }
        sx={{
          px: 1.2,
          textTransform: "none",
          color: "text.primary",
          borderRadius: 2,
          boxShadow: "0px 2px 10px rgba(118, 118, 118, 0.15)",
          backgroundColor: "#FFF",
          "&:hover": {
            backgroundColor: "#EEEFF3"
          }
        }}
      >
        Sorted by
      </Button>

      <Menu
        id="sort-menu"
        open={openSortMenu}
        anchorEl={anchorEl}
        onClose={handleSortMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        sx={{
          "& .MuiPaper-root": {
            mt: 1,
            borderRadius: "8px",
            boxShadow:
              "0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.03),0px 3px 14px 2px rgba(0, 0, 0, 0.05)"
          },
          "& .MuiMenu-list": {
            py: 0
          }
        }}
      >
        {sortOptions.map((option, index) => (
          <MenuItem
            key={index}
            selected={option.value === sortField}
            onClick={() => {
              handleSortFieldSelect(option.value)
              handleSortMenuClose()
            }}
            sx={{
              py: 0,
              minHeight: "40px !important",
              minWidth: "114px !important",
              "&.Mui-selected": {
                backgroundColor: "#ebf1ffff",
                "&:hover": {
                  backgroundColor: "primary.light"
                }
              }
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
