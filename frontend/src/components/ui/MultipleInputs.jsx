import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import ClearIcon from "@mui/icons-material/Clear"

export default function MultipleInputs({ inputs, onInputAdd }) {
  return (
    <Autocomplete
      multiple
      freeSolo
      options={[]}
      value={inputs || []}
      onChange={(event, newValues) => onInputAdd(newValues)}
      renderTags={(value, getTagProps) =>
        value?.map((option, index) => {
          const { key, ...restTagProps } = getTagProps({ index })
          return (
            <Chip
              key={key}
              label={option}
              {...restTagProps}
              deleteIcon={<ClearIcon />}
              sx={{
                "& .MuiChip-deleteIcon": {
                  color: "#A2A2A2 !important",
                  "&:hover": {
                    color: "rgba(0, 0, 0, 0.87) !important"
                  },
                  fontSize: "20px",
                  paddingTop: "4px",
                  margin: "0 5px 4px -6px !important"
                },
                "& .MuiChip-label": {
                  paddingRight: "10px"
                }
              }}
            />
          )
        })
      }
      renderInput={(params) => (
        <Box
          sx={{
            borderRadius: "4px"
          }}
        >
          <TextField {...params} variant="outlined" placeholder="+ Add tags" />
        </Box>
      )}
      sx={{
        width: "100%",
        "& .MuiAutocomplete-inputRoot": {
          justifyContent: "left",
          flexWrap: "wrap",
          rowGap: 1,
          gap: 1
        },
        "& .MuiAutocomplete-input": {
          minWidth: "82px !important",
          maxWidth: "82px !important",
          py: "6px !important",
          px: "4px !important"
        },
        "& .MuiOutlinedInput-root": {
          minHeight: "40px",
          padding: "4px 8px !important",
          "& fieldset": {
            border: "none"
          },
          ":focus-within": {
            padding: "4px 7px !important"
          }
        },
        "& .MuiAutocomplete-tag": {
          margin: 0,
          maxWidth: "none",
          fontWeight: 500,
          borderRadius: "8px",
          backgroundColor: "#f2f6ff"
        }
      }}
    />
  )
}
