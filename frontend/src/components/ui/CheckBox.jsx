import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded"
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded"

export default function CheckBox({
  fieldName,
  option,
  selected,
  onCheckBoxClick
}) {
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {selected === option.value ? (
        <CheckBoxRoundedIcon
          sx={{ cursor: "pointer" }}
          onClick={() => onCheckBoxClick(fieldName, null)}
        />
      ) : (
        <CheckBoxOutlineBlankRoundedIcon
          sx={{ cursor: "pointer" }}
          onClick={() => {
            onCheckBoxClick(fieldName, option.value)
          }}
        />
      )}
      <Typography>{option.label}</Typography>
    </Box>
  )
}
