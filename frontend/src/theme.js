import { createTheme, darken } from "@mui/material/styles"

// Create a theme instance.
let theme = createTheme({})

theme = createTheme(theme, {
  cssVariables: true,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "*": {
            fontFamily: "Poppins, sans-serif !important"
          },
          "*::-webkit-scrollbar-thumb": {
            borderRadius: "12px"
          },
          "*::-webkit-scrollbar-thumb:hover": {
            cursor: "default"
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF"
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          "&::-webkit-scrollbar": {
            width: "8px"
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#d1deff"
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#b8ceff"
          }
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(1)
        })
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          //color: '#495057',
          fontSize: "0.9rem"
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(1),
          borderRadius: "6px"
        })
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
          width: "34px",
          height: "34px",
          minWidth: "34px",
          minHeight: "34px",
          boxShadow: "none",
          backgroundColor: "#F7F8FC",
          "&: hover": {
            backgroundColor: "#e8e9eb"
          }
        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          fontSize: "0.8rem",
          "&::before": {
            borderBottom: "1px solid #ccd2db"
          },
          "&:hover": {
            backgroundColor: "#f2f6ff"
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.95rem"
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: "0.9rem",
          "&:hover:not(.Mui-error) .MuiOutlinedInput-notchedOutline": {
            borderColor: "#80a5ff"
          },
          "&:hover.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            borderColor: "#B6B6B6"
          },
          "& .Mui-error": {
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#D3302F"
            },
            "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
              borderColor: "#D3302F"
            }
          },
          "& fieldset": {
            borderColor: "#d6d6d8",
            borderWidth: "1px"
          }
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        listbox: {
          "& .MuiAutocomplete-option[aria-selected=true]": {
            fontWeight: 500,
            backgroundColor: "#f2f6ff"
          },
          "& .MuiAutocomplete-option[aria-selected=true].Mui-focused": {
            backgroundColor: "#d9e5ff"
          }
        }
      }
    },
    MuiClock: {
      styleOverrides: {
        root: {
          margin: "16px 24px"
        },
        clock: {
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 0px 14px 6px rgba(0, 0, 0, 0.04)"
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "black"
        },
        arrow: {
          color: "black"
        }
      }
    },
    MuiPickersDay: {
      styleOverrides: {
        today: {
          border: "1px solid #598aff !important"
        }
      }
    }
  },

  sideBar: {
    width: {
      open: "230px",
      close: "56px"
    },
    colorSchemes: {
      hover: {
        content: "#598aff",
        background: "#e2eafc"
      },
      standard: {
        content: "#FFFFFF",
        background: "#719bff"
      }
    }
  },

  palette: {
    primary: {
      main: "#80a5ff",
      light: "#D7E3FC",
      dark: "#598aff"
    },
    secondary: {
      main: "#19857b"
    },
    background: {
      default: "#F7F8FC",
      paper: "#F7F8FC"
    },

    taskColorPalette: {
      pink: {
        main: "#fef6f6",
        dark: darken("#fef6f6", 0.02)
      }
    },

    tagColorPalette: {},

    delete: {
      main: "#ec7678"
    },

    grey: theme.palette.augmentColor({
      color: {
        light: "#f5f5f5",
        main: "#b8b8b8"
      },
      name: "grey"
    }),

    green: theme.palette.augmentColor({
      color: {
        light: "#f3f7e9",
        main: "#c0d492"
      },
      name: "green"
    }),

    orange: theme.palette.augmentColor({
      color: {
        light: "#fff1eb",
        main: "#fbc4ab"
      },
      name: "orange"
    }),

    red: theme.palette.augmentColor({
      color: {
        light: "#fceae8",
        main: "#f4978e"
      },
      name: "red"
    })
  },

  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),

    h0: {
      fontSize: "1.6rem"
    },
    h1: {
      fontSize: "1.2rem"
    },
    h2: {
      fontSize: "0.9rem"
    },
    body1: {
      fontSize: "0.8rem"
    },
    body2: {
      fontSize: "0.6rem"
    }
  },

  transitions: {
    duration: {
      standard: "300ms",
      enteringScreen: "300ms",
      leavingScreen: "300ms"
    }
  },

  zIndex: {
    modal: 1500
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 500,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
})

export default theme
