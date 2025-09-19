import * as React from "react"
import Box from "@mui/material/Box"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import CustomSubmitButton from "./CustomSubmitButton"
import Typography from "@mui/material/Typography"
import SvgIcon from "@mui/material/SvgIcon"

const DeleteIcon = () => (
  <SvgIcon sx={{ fontSize: "1.8rem", color: "#D14B58" }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path
          d="M17.25 21H6.75a1.5 1.5 0 0 1-1.5-1.5V6h13.5v13.5a1.5 1.5 0 0 1-1.5 1.5"
          clipRule="evenodd"
        ></path>
        <path d="M9.75 16.5v-6m4.5 6v-6M2.25 6h19.5"></path>
        <path
          d="M14.25 3h-4.5a1.5 1.5 0 0 0-1.5 1.5V6h7.5V4.5a1.5 1.5 0 0 0-1.5-1.5"
          clipRule="evenodd"
        ></path>
      </g>
    </svg>
  </SvgIcon>
)

export default function CustomDeleteDialog({
  openDeleteDialogState,
  name,
  isDeleting,
  isDeleted,
  onDelete
}) {
  const { openDeleteDialog, setOpenDeleteDialog } = openDeleteDialogState

  return (
    <Dialog
      open={openDeleteDialog}
      onClose={(event, reason) => {
        if (String(reason) === "backdropClick") return
        setOpenDeleteDialog(false)
      }}
      slotProps={{
        paper: {
          sx: {
            margin: 4,
            padding: "40px 8px 20px",
            borderRadius: "12px"
          }
        }
      }}
      sx={{
        "& .MuiDialogContent-root": {
          padding: "12px 24px"
        }
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: 1,
            width: "fit-content",
            backgroundColor: "#FCF3F4",
            borderRadius: "12px"
          }}
        >
          <DeleteIcon />
        </Box>
        <DialogTitle sx={{ padding: "16px 24px 0", fontSize: "1.1rem" }}>
          Delete
        </DialogTitle>
      </Box>
      <DialogContent sx={{ padding: "4px 24px 20px !important" }}>
        <Typography
          fontSize="0.8rem"
          color="#8A8A8A"
          sx={{ textAlign: "center" }}
        >
          Are you sure you want to delete {name}?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 1 }}>
        <Button
          variant="contained"
          onClick={() => setOpenDeleteDialog(false)}
          sx={{
            width: "120px",
            fontSize: "0.8rem",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "12px",
            boxShadow: "none",
            backgroundColor: "#F7F7F7",
            color: "text.primary",
            "&:hover": {
              boxShadow: "none",
              backgroundColor: "#f1f1f1"
            }
          }}
        >
          Cancel
        </Button>
        <CustomSubmitButton
          buttonName="Confirm"
          handleClick={onDelete}
          isLoading={isDeleting}
          isSuccess={isDeleted}
          props={{
            width: "120px",
            height: "100%",
            fontSize: "0.8rem",
            borderRadius: "12px",
            backgroundColor: "#D14B58"
          }}
        />
      </DialogActions>
    </Dialog>
  )
}
