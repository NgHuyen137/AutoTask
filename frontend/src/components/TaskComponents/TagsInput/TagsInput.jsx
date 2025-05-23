import { useState, useRef, useEffect } from "react"
import { useScreenSize } from "~/hooks/useEffect"
import { useMediaQuery } from "@mui/material"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete"
import ClearIcon from "@mui/icons-material/Clear"
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded"
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded"

const filter = createFilterOptions()

const useCheckTagsOverflow = (
  tagStackRef,
  minScrollWidth,
  task,
  screenWidth,
  setIsTagsOverflow
) => {
  useEffect(() => {
    setIsTagsOverflow(
      tagStackRef.current?.scrollWidth > tagStackRef.current?.clientWidth &&
        tagStackRef.current?.scrollWidth > minScrollWidth
    )
  }, [task.tags, screenWidth])
}

export function CompactTagsInput({ taskState, props, tagsOverflowState }) {
  const { task, updateTask } = taskState
  const { popperWidth, minScrollWidth, autoCompleteMaxWidth } = props

  const tagStackRef = useRef(null)
  const autoCompleteRef = useRef(null)
  const { isTagsOverflow, setIsTagsOverflow } = tagsOverflowState

  const [options, setOptions] = useState(["Study", "Work", "Personal"])
  const scrollAmount = autoCompleteRef.current?.clientWidth * 0.1

  const screenWidth = useScreenSize()

  const isLessThan280 = useMediaQuery("(max-width: 279px)")

  useCheckTagsOverflow(
    tagStackRef,
    minScrollWidth,
    task,
    screenWidth,
    setIsTagsOverflow
  )

  return (
    <Box
      ref={autoCompleteRef}
      tabIndex={0}
      sx={{
        width: "100%",
        height: "40px",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        border: "1px solid #D6D6D8",
        borderRadius: "4px",
        ":hover": {
          border: "1px solid #80a5ff"
        },
        ":focus-within": {
          border: "2px solid #80a5ff"
        }
      }}
    >
      <Autocomplete
        id="task-tags"
        multiple // Allow multiple tags
        freeSolo // Allow users to enter new tags
        disableCloseOnSelect={true}
        clearIcon={null}
        value={task.tags.map((value) => value["name"])}
        options={options}
        onChange={(event, newTags) => {
          const cleanedTags = newTags.map((tag) =>
            typeof tag === "string" ? tag : tag.value
          )
          updateTask(
            "tags",
            cleanedTags.map((tag) => ({ name: tag, is_preferred: false }))
          )
          setOptions((prevOptions) => [
            ...new Set([...prevOptions, ...cleanedTags])
          ])
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params)
          const { inputValue } = params // User-defined tag
          const isExisting = options.includes(inputValue) // Check if the tag already exists
          if (inputValue !== "" && !isExisting) {
            // Add new tag defined by the user
            filtered.push({
              value: inputValue,
              label: `Create ${inputValue}`
            })
          }
          return filtered
        }}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props
          return (
            <li key={key} {...optionProps}>
              {option.label ? option.label : option}
            </li>
          )
        }}
        getOptionLabel={(option) => (option.value ? option.value : option)}
        renderTags={(value, getTagProps) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flex: 1,
              px: "4px",
              overflow: "hidden"
            }}
          >
            {isTagsOverflow && (
              <IconButton
                sx={{
                  width: "21px",
                  height: "21px",
                  boxShadow: "0 0 4px 2px rgba(200, 200, 201, 0.3)"
                }}
                onClick={() => {
                  if (tagStackRef.current)
                    tagStackRef.current.scrollLeft -= scrollAmount
                }}
              >
                <KeyboardArrowLeftRoundedIcon sx={{ color: "primary.main" }} />
              </IconButton>
            )}
            <Stack
              ref={tagStackRef}
              direction="row"
              sx={{
                gap: 1,
                overflow: "hidden"
              }}
            >
              {value?.map((option, index) => {
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
                        fontSize: "16px"
                      },
                      "& .MuiChip-label": {
                        paddingRight: "10px"
                      }
                    }}
                  />
                )
              })}
            </Stack>
          </Box>
        )}
        renderInput={(params) => (
          <Box
            sx={{
              borderRadius: "4px"
            }}
          >
            <TextField {...params} variant="outlined" placeholder="Add tags" />
          </Box>
        )}
        slotProps={{
          paper: {
            sx: {
              width: popperWidth,
              px: "4px",
              margin: "8px 0",
              boxShadow:
                "0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.03),0px 3px 14px 2px rgba(0, 0, 0, 0.05)"
            }
          },
          popper: {
            disablePortal: true,
            anchorEl: () => autoCompleteRef.current,
            placement: "bottom-start"
          },
          listbox: {
            sx: {
              py: "4px",
              display: "flex",
              flexDirection: "column",
              gap: 0.6,
              "& .MuiAutocomplete-option": {
                borderRadius: "4px",
                minHeight: "32px"
              }
            }
          }
        }}
        sx={{
          width: "100%",
          ...(isTagsOverflow
            ? isLessThan280
              ? { maxWidth: "184px" }
              : { maxWidth: autoCompleteMaxWidth }
            : {}),
          "& .MuiAutocomplete-inputRoot": {
            flexWrap: "nowrap",
            flexDirection: "row-reverse",
            justifyContent: "left"
          },
          "& .MuiAutocomplete-input": {
            maxWidth: "70px",
            py: "6px !important",
            px: "4px !important"
          },
          "& .MuiOutlinedInput-root": {
            minHeight: "40px",
            padding: "0 8px !important",
            "& fieldset": {
              border: "none"
            },
            ":focus-within": {
              padding: "0 7px !important"
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
      {isTagsOverflow && (
        <IconButton
          sx={{
            width: "21px",
            height: "21px",
            boxShadow: "0 0 4px 2px rgba(200, 200, 201, 0.3)"
          }}
          onClick={() => {
            if (tagStackRef.current)
              tagStackRef.current.scrollLeft += scrollAmount
          }}
        >
          <KeyboardArrowRightRoundedIcon sx={{ color: "primary.main" }} />
        </IconButton>
      )}
    </Box>
  )
}

const useOptions = (task, setOptions) => {
  // Update options
  useEffect(() => {
    if (task.tags) {
      setOptions((prevOptions) => {
        const newTags = task.tags.map((tag) => tag["name"])
        return Array.from(new Set([...prevOptions, ...newTags]))
      })
    }
  }, [task.tags])
}

const useTrackTaskSidebarChange = (setOpenTagsInput, autoCompleteRef) => {
  useEffect(() => {
    const handleMouseDown = (event) => {
      if (!autoCompleteRef?.current.contains(event.target))
        setOpenTagsInput(false)
    }

    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [])
}

export function ExpandedTagsInput({ taskState, props }) {
  const { task, updateTask } = taskState
  const { popperWidth } = props
  const [options, setOptions] = useState(["Study", "Work", "Personal"])
  const [openTagsInput, setOpenTagsInput] = useState(false)
  const autoCompleteRef = useRef(null)

  useOptions(task, setOptions)
  useTrackTaskSidebarChange(setOpenTagsInput, autoCompleteRef)

  return (
    <Box
      ref={autoCompleteRef}
      tabIndex={0}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        border: "1px solid #D6D6D8",
        borderRadius: "4px",
        ":hover": {
          border: "1px solid #80a5ff"
        },
        ":focus-within": {
          border: "2px solid #80a5ff"
        }
      }}
    >
      <Autocomplete
        open={openTagsInput}
        id="task-tags"
        multiple // Allow multiple tags
        freeSolo // Allow users to enter new tags
        disableCloseOnSelect={true}
        clearIcon={null}
        value={task.tags.map((value) => value["name"])}
        options={options}
        onOpen={() => setOpenTagsInput(true)}
        onClose={() => setOpenTagsInput(false)}
        onChange={(event, newTags) => {
          const cleanedTags = newTags.map((tag) =>
            typeof tag === "string" ? tag : tag.value
          )
          updateTask(
            "tags",
            cleanedTags.map((tag) => ({ name: tag, is_preferred: false }))
          )
          setOptions((prevOptions) => [
            ...new Set([...prevOptions, ...cleanedTags])
          ])
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params)
          const { inputValue } = params // User-defined tag
          const isExisting = options.includes(inputValue) // Check if the tag already exists
          if (inputValue !== "" && !isExisting) {
            // Add new tag defined by the user
            filtered.push({
              value: inputValue,
              label: `Create ${inputValue}`
            })
          }
          return filtered
        }}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props
          return (
            <li key={key} {...optionProps}>
              {option.label ? option.label : option}
            </li>
          )
        }}
        getOptionLabel={(option) => (option.value ? option.value : option)}
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
            <TextField
              {...params}
              variant="outlined"
              placeholder="+ Add tags"
            />
          </Box>
        )}
        slotProps={{
          paper: {
            sx: {
              //minWidth: "414px",
              //maxWidth: "547px",
              width: popperWidth,
              px: "4px",
              margin: "8px 0",
              boxShadow:
                "0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.03),0px 3px 14px 2px rgba(0, 0, 0, 0.05)"
            }
          },
          popper: {
            disablePortal: true,
            anchorEl: () => autoCompleteRef.current,
            placement: "bottom-start",
            modifiers: [
              {
                name: "flip",
                options: {
                  fallbackPlacements: []
                }
              }
            ]
          },
          listbox: {
            sx: {
              py: "4px",
              display: "flex",
              flexDirection: "column",
              gap: 0.6,
              "& .MuiAutocomplete-option": {
                borderRadius: "4px"
              }
            }
          }
        }}
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
    </Box>
  )
}
