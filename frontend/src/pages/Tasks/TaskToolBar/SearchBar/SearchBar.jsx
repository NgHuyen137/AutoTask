import { Link } from "react-router-dom"

import { grey } from "@mui/material/colors"

import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import InputAdornment from "@mui/material/InputAdornment"
import Typography from "@mui/material/Typography"
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined"

const SearchIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <g className="search-outline">
        <g
          fill="currentColor"
          fillRule="evenodd"
          className="Vector"
          clipRule="evenodd"
        >
          <path d="M11 17a6 6 0 1 0 0-12a6 6 0 0 0 0 12m0 2a8 8 0 1 0 0-16a8 8 0 0 0 0 16"></path>
          <path d="M15.32 15.29a1 1 0 0 1 1.414.005l3.975 4a1 1 0 0 1-1.418 1.41l-3.975-4a1 1 0 0 1 .004-1.414Z"></path>
        </g>
      </g>
    </svg>
  )
}

export default function SearchBar({ tasks, searchInput, onSearchInputChange }) {
  return (
    <Autocomplete
      freeSolo
      options={searchInput ? tasks || [] : []}
      inputValue={searchInput}
      onInputChange={onSearchInputChange}
      getOptionLabel={(option) => option?.name || ""}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Search tasks..."
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    width="1rem"
                    height="1rem"
                    sx={{ color: "#A2A2A2" }}
                  />
                </InputAdornment>
              )
            }
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...rest } = props
        return (
          <Box
            {...rest}
            key={key}
            component={Link}
            to={`/tasks/${option._id}`}
            sx={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              gap: 1,
              margin: 1,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#F7F8FC !important"
              },
              "&.Mui-focused": {
                backgroundColor: "#F7F8FC !important"
              }
            }}
          >
            <AssignmentTurnedInOutlinedIcon
              sx={{ color: grey[400], fontSize: "1rem" }}
            />
            <Typography sx={{ fontWeight: 500 }}>{option.name}</Typography>
          </Box>
        )
      }}
      slotProps={{
        popper: {
          sx: {
            "& .MuiAutocomplete-paper": {
              marginTop: 1,
              overflowX: "hidden",
              borderRadius: "8px",
              boxShadow: "0px 2px 10px rgba(118, 118, 118, 0.15)"
            },
            "& .MuiAutocomplete-listbox": {
              py: "0px !important"
            },
            "& .MuiAutocomplete-option": {
              minHeight: "40px !important",
              py: "0px !important"
            }
          }
        }
      }}
      sx={{
        borderRadius: "8px",
        width: { xs: "100%", sm: 300 },
        "& .MuiAutocomplete-input": {
          py: "0px !important",
          paddingRight: 1,
          paddingLeft: "0px !important"
        },
        backgroundColor: "#EEEFF3",
        "&:hover": {
          backgroundColor: "background.paper"
        },
        "&.Mui-focused": {
          backgroundColor: "background.paper"
        },
        "& .MuiOutlinedInput-root": {
          fontSize: "0.8rem",
          borderRadius: "8px"
        },
        "& .MuiOutlinedInput-input": {
          py: 1
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#EEEFF3",
          "&:hover": {
            borderColor: "primary.main"
          },
          "&.Mui-focused": {
            borderColor: "primary.main"
          }
        }
      }}
    />
  )
}
