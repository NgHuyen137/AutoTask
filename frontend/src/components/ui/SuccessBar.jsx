import Slide from "@mui/material/Slide"
import Snackbar from "@mui/material/Snackbar"

const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />
}

export default function SuccessBar({
  message,
  openSuccessBar,
  onCloseSuccessBar
}) {
  return (
    <Snackbar
      open={openSuccessBar}
      autoHideDuration={1200}
      onClose={onCloseSuccessBar}
      message={message}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      TransitionComponent={SlideTransition}
      //TransitionProps={{ unmountOnExit: true }}
      // TransitionComponent={(props) =>
      //   <Slide
      //     {...props}
      //     direction="up"
      //     mountOnEnter
      //     unmountOnExit
      //     in={enterUpdateSuccessBar}
      //     onExited={() => setOpenUpdateSuccessBar(false)}
      //   />
      // }
      sx={{
        "& .MuiSnackbarContent-root": {
          justifyContent: "center",
          minWidth: "200px",
          maxWidth: "200px"
        },
        "& .MuiSnackbarContent-message": {
          fontSize: "0.8rem",
          fontWeight: 500
        }
      }}
    />
  )
}
