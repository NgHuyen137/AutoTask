import SearchBar from "./SearchBar/SearchBar"
import SortButton from "./SortButton/SortButton"
import FilterButton from "./Filters/FilterButton/FilterButton"
import FilterMenu from "./Filters/FilterMenu/FilterMenu"

import { useState } from "react"

import Box from "@mui/material/Box"

export default function TaskToolBar({
  tasks,
  filters,
  updateFilters,
  clearFilters,
  updateParams,
  searchInput,
  onSearchInputChange
}) {
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)

  const handleFilterButtonClick = (event) => {
    filterAnchorEl === null
      ? setFilterAnchorEl(event.currentTarget)
      : setFilterAnchorEl(null)
  }

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null)
  }

  return (
    <Box
      sx={{
        py: 3,
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: "row"
        },
        gap: 2
      }}
    >
      <SearchBar
        tasks={tasks}
        searchInput={searchInput}
        onSearchInputChange={onSearchInputChange}
      />

      <Box
        sx={{
          display: "flex",
          gap: 2
        }}
      >
        <FilterButton onFilterButtonClick={handleFilterButtonClick} />
        <SortButton updateParams={updateParams} />
      </Box>

      <FilterMenu
        filterAnchorEl={filterAnchorEl}
        filters={filters}
        updateFilters={updateFilters}
        clearFilters={clearFilters}
        updateParams={updateParams}
        onFilterMenuClose={handleFilterMenuClose}
      />
    </Box>
  )
}
