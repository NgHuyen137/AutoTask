import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"

export default function CustomMenu({
  options,
  selectedOption,
  openMenu,
  anchorEl,
  onCloseMenu,
  onSelectOption
}) {
  return (
    <Menu
      id="priority-menu"
      open={openMenu}
      anchorEl={anchorEl}
      onClose={onCloseMenu}
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
      {options.map((option, index) => (
        <MenuItem
          key={index}
          selected={option.value === selectedOption}
          onClick={() => {
            onSelectOption(option.value)
            onCloseMenu()
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
  )
}
