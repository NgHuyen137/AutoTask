import Button from "@mui/material/Button"

const FilterIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="1.5"
        d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"
      ></path>
    </svg>
  )
}

export default function FilterButton({ onFilterButtonClick }) {
  return (
    <Button
      onClick={onFilterButtonClick}
      startIcon={<FilterIcon width="1rem" height="1rem" color="#747577" />}
      sx={{
        px: 1.2,
        textTransform: "none",
        color: "text.primary",
        borderRadius: 2,
        boxShadow: "0px 2px 10px rgba(118, 118, 118, 0.15)",
        backgroundColor: "#FFF",
        "&:hover": {
          backgroundColor: "#EEEFF3"
        }
      }}
    >
      Filter
    </Button>
  )
}
