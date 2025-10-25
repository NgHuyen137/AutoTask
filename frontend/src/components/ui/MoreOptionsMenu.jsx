import Popper from "@mui/material/Popper"
import Grow from "@mui/material/Grow"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import SvgIcon from "@mui/material/SvgIcon"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined"
import CustomDeleteDialog from "~/components/ui/CustomDeleteDialog"

export default function MoreOptionsMenu({
  taskStatus,
  onMarkTaskDone,
  onMarkTaskIncomplete,
  onOpenEditTask,
  openMoreOptions,
  moreOptionsAnchor,
  moreOptionsPaperRef,
  openDeleteDialog,
  onOpenDeleteDialog,
  onCloseDeleteDialog,
  deleteName,
  isDeleting,
  isDeleted,
  onDeleteTask
}) {
  return (
    <>
      <Popper
        disablePortal
        transition
        placement="left-end"
        open={openMoreOptions}
        anchorEl={moreOptionsAnchor}
        sx={{ zIndex: 1600 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={350}>
            <Paper
              ref={moreOptionsPaperRef}
              sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "12px",
                boxShadow:
                  "0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.03),0px 3px 14px 2px rgba(0, 0, 0, 0.05)"
              }}
            >
              <List
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  padding: 0
                }}
              >
                <Button
                  onClick={onOpenEditTask}
                  sx={{
                    textTransform: "none",
                    padding: 0,
                    borderRadius: "12px 12px 0 0",
                    color: "text.primary",
                    ":hover": {
                      backgroundColor: "#f5f5f5"
                    }
                  }}
                >
                  <ListItem sx={{ padding: "2px 16px" }}>
                    <ListItemIcon sx={{ minWidth: "24px" }}>
                      <SvgIcon sx={{ fontSize: "0.9rem", color: "#9e9e9e" }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="1em"
                          height="1em"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
                          ></path>
                        </svg>
                      </SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      sx={{
                        "& .MuiTypography-root": { fontSize: "0.8rem" }
                      }}
                    >
                      Edit
                    </ListItemText>
                  </ListItem>
                </Button>

                {!taskStatus ? (
                  <Button
                    onClick={onMarkTaskDone}
                    sx={{
                      textTransform: "none",
                      padding: 0,
                      color: "text.primary",
                      ":hover": {
                        backgroundColor: "#f5f5f5"
                      }
                    }}
                  >
                    <ListItem sx={{ padding: "2px 16px" }}>
                      <ListItemIcon sx={{ minWidth: "24px" }}>
                        <CheckCircleOutlineOutlinedIcon
                          sx={{ fontSize: "1rem", color: "#9e9e9e" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        sx={{
                          "& .MuiTypography-root": { fontSize: "0.8rem" }
                        }}
                      >
                        Mark done
                      </ListItemText>
                    </ListItem>
                  </Button>
                ) : (
                  <Button
                    onClick={onMarkTaskIncomplete}
                    sx={{
                      textTransform: "none",
                      padding: 0,
                      color: "text.primary",
                      ":hover": {
                        backgroundColor: "#f5f5f5"
                      }
                    }}
                  >
                    <ListItem sx={{ padding: "2px 16px" }}>
                      <ListItemIcon sx={{ minWidth: "24px" }}>
                        <CheckCircleOutlineOutlinedIcon
                          sx={{ fontSize: "1rem", color: "#9e9e9e" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        sx={{
                          "& .MuiTypography-root": { fontSize: "0.8rem" }
                        }}
                      >
                        Mark incomplete
                      </ListItemText>
                    </ListItem>
                  </Button>
                )}
                <Button
                  onClick={onOpenDeleteDialog}
                  sx={{
                    textTransform: "none",
                    padding: 0,
                    borderRadius: "0 0 12px 12px",
                    color: "text.primary",
                    ":hover": {
                      backgroundColor: "#f5f5f5"
                    }
                  }}
                >
                  <ListItem sx={{ padding: "2px 16px" }}>
                    <ListItemIcon sx={{ minWidth: "24px" }}>
                      <DeleteOutlinedIcon
                        sx={{ fontSize: "1rem", color: "#9e9e9e" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      sx={{
                        "& .MuiTypography-root": { fontSize: "0.8rem" }
                      }}
                    >
                      Delete
                    </ListItemText>
                  </ListItem>
                </Button>
              </List>
            </Paper>
          </Grow>
        )}
      </Popper>
      {openDeleteDialog && (
        <CustomDeleteDialog
          openDeleteDialog={openDeleteDialog}
          onCloseDeleteDialog={onCloseDeleteDialog}
          name={deleteName}
          isDeleting={isDeleting}
          isDeleted={isDeleted}
          onDelete={onDeleteTask}
        />
      )}
    </>
  )
}
