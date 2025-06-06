import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"

export default function CustomSubmitButton({
  buttonName,
  handleClick,
  isLoading,
  isSuccess,
  props
}) {
  return (
    <>
      {!isSuccess && !isLoading && (
        <Button
          sx={{
            ...props,
            ...(props?.py ? {} : {
              height: props?.height || "32px",
              width: props?.width || "86px",
              alignSelf: "end"
            }),
            borderRadius: props?.borderRadius || "40px",
            boxShadow: props?.boxShadow ||
              "0px 1px 5px 0px rgba(0, 0, 0, 0.06), 0px 2px 2px 0px rgba(0, 0, 0, 0.03), 0px 3px 1px -2px rgba(0, 0, 0, 0.05)",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              boxShadow: props?.boxShadow ||
                "0px 1px 5px 0px rgba(0, 0, 0, 0.06), 0px 2px 2px 0px rgba(0, 0, 0, 0.03), 0px 3px 1px -2px rgba(0, 0, 0, 0.05)",
              backgroundColor:
                props?.backgroundColor === "#D14B58" ? "#bd424e" : "#598aff"
            }
          }}
          variant="contained"
          onClick={handleClick}
        >
          {buttonName}
        </Button>
      )}

      {isSuccess && (
        <Button
          sx={{
            ...props,
            ...(props?.py ? {} : {
              height: props?.height || "32px",
              width: props?.width || "86px",
              alignSelf: "end"
            }),
            borderRadius: props?.borderRadius || "40px",
            boxShadow:
              "0px 1px 5px 0px rgba(0, 0, 0, 0.06), 0px 2px 2px 0px rgba(0, 0, 0, 0.03), 0px 3px 1px -2px rgba(0, 0, 0, 0.05)",
            fontWeight: "bold",
            backgroundColor: "#6cba87 !important",
            "&:hover": {
              boxShadow:
                "0px 1px 5px 0px rgba(0, 0, 0, 0.06), 0px 2px 2px 0px rgba(0, 0, 0, 0.03), 0px 3px 1px -2px rgba(0, 0, 0, 0.05)"
            }
          }}
          disabled
          variant="contained"
          onClick={handleClick}
        >
          <CheckCircleRoundedIcon
            sx={{ color: "#d2e9db", fontSize: "1.2rem" }}
          />
        </Button>
      )}

      {isLoading && (
        <Button
          disabled
          sx={{
            ...props,
            ...(props?.py ? {} : {
              height: props?.height || "32px",
              width: props?.width || "86px",
              alignSelf: "end"
            }),
            borderRadius: props?.borderRadius || "40px",
            boxShadow:
              "0px 1px 5px 0px rgba(0, 0, 0, 0.06), 0px 2px 2px 0px rgba(0, 0, 0, 0.03), 0px 3px 1px -2px rgba(0, 0, 0, 0.05)",
            fontWeight: "bold",
            color: "#FFFFFF !important",
            "&:hover": {
              boxShadow:
                "0px 1px 5px 0px rgba(0, 0, 0, 0.06), 0px 2px 2px 0px rgba(0, 0, 0, 0.03), 0px 3px 1px -2px rgba(0, 0, 0, 0.05)"
            }
          }}
          variant="contained"
          onClick={handleClick}
        >
          <CircularProgress color="#FFFFFF !important" size="1rem" />
        </Button>
      )}
    </>
  )
}
