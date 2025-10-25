import { useState } from "react"
import { grey } from "@mui/material/colors"

import CustomMenu from "./CustomMenu"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded"
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded"
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded"
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded"

export default function PaginationBar({
  limit,
  page,
  totalPages,
  openLimitMenu,
  limitAnchorEl,
  onLimitChange,
  onPageChange,
  onOpenLimitMenu,
  onCloseLimitMenu
}) {
  const [startPage, setStartPage] = useState(page % 2 === 0 ? page - 1 : page)

  const handleNextPage = () => {
    onPageChange(page + 1)
    if (page % 2 === 0) setStartPage(page + 1)
  }

  const handlePrevPage = () => {
    onPageChange(page - 1)
    if (page % 2 !== 0) setStartPage(page - 2)
  }

  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber)
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mt: 1
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1
        }}
      >
        <Typography sx={{ fontWeight: 500 }}>Showing</Typography>
        <Button
          variant="text"
          endIcon={
            openLimitMenu ? (
              <ExpandLessRoundedIcon />
            ) : (
              <ExpandMoreRoundedIcon />
            )
          }
          onClick={onOpenLimitMenu}
          sx={{
            borderRadius: "8px"
          }}
        >
          {limit}
        </Button>
        <CustomMenu
          options={[
            { label: "10", value: 10 },
            { label: "20", value: 20 },
            { label: "50", value: 50 },
            { label: "100", value: 100 }
          ]}
          selectedOption={limit}
          openMenu={openLimitMenu}
          anchorEl={limitAnchorEl}
          onCloseMenu={onCloseLimitMenu}
          onSelectOption={onLimitChange}
        />
      </Box>

      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          <IconButton
            sx={{ padding: "4px" }}
            disabled={page === 1}
            onClick={handlePrevPage}
          >
            <KeyboardArrowLeftRoundedIcon
              sx={{
                fontSize: "1.5rem",
                color: page > 1 && "text.primary"
              }}
            />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              maxWidth: "68px",
              overflow: "hidden",
              ellipsis: "true",
              whiteSpace: "nowrap"
            }}
          >
            {[...Array(2)].map((_, index) => (
              <IconButton
                key={index}
                disabled={startPage + index > totalPages}
                sx={{
                  padding: "3px",
                  backgroundColor:
                    page === startPage + index ? "primary.main" : "transparent",
                  "&:hover": {
                    backgroundColor:
                      page === startPage + index ? "primary.dark" : "#EDEEF2"
                  }
                }}
                onClick={(event) =>
                  handlePageClick(parseInt(event.currentTarget.textContent))
                }
              >
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 500,
                    width: "24px",
                    height: "24px",
                    color:
                      page === startPage + index
                        ? "#FFF"
                        : startPage + index > totalPages
                        ? grey[400]
                        : "text.primary"
                  }}
                >
                  {startPage + index}
                </Typography>
              </IconButton>
            ))}
          </Box>

          <IconButton
            sx={{ padding: "4px" }}
            disabled={page === totalPages}
            onClick={handleNextPage}
          >
            <KeyboardArrowRightRoundedIcon
              sx={{
                fontSize: "1.5rem",
                color: page < totalPages && "text.primary"
              }}
            />
          </IconButton>
        </Box>
      )}
    </Box>
  )
}
