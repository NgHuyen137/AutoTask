import { useState, useEffect, useRef } from "react"
import { useFilters } from "~/hooks/useFilters"
import { useFetchAllTasks } from "~/hooks/useQuery"

import Spinner from "~/components/ui/Spinner"
import TaskList from "./TaskList/TaskList"
import TaskToolBar from "./TaskToolBar/TaskToolBar"

import Box from "@mui/material/Box"

export default function Tasks() {
  const {
    filters,
    updateFilters,
    clearFilters,
    searchParams,
    getParam,
    updateParams
  } = useFilters()

  const prevSearchParams = useRef(searchParams)
  const prevFilters = useRef(filters)

  const [searchInput, setSearchInput] = useState("")
  const [limit, setLimit] = useState(parseInt(getParam("limit")) || 20)
  const [page, setPage] = useState(parseInt(getParam("page")) || 1)
  const [openLimitMenu, setOpenLimitMenu] = useState(false)
  const limitAnchorEl = useRef(null)
  const prevLimit = useRef(limit)

  const appliedfilters = Object.fromEntries(searchParams.entries())
  const { data, error } = useFetchAllTasks({
    ...appliedfilters,
    limit: limit,
    page: page
  })
  console.log(data)
  console.log("Applied filters:", appliedfilters)

  useEffect(() => {
    const keys = Object.keys(searchParams).filter((k) => k !== "page")
    const hasParamsChanged = keys.some(
      (key) => searchParams[key] !== prevSearchParams.current[key]
    )

    const hasFiltersChanged = Object.keys(filters).some(
      (key) => filters[key] !== prevFilters.current[key]
    )

    const hasLimitChanged = limit !== prevLimit.current

    if (hasParamsChanged || hasFiltersChanged || hasLimitChanged) setPage(1)
    prevSearchParams.current = searchParams
    prevFilters.current = filters
    prevLimit.current = limit
  }, [searchParams, filters, limit])

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value)
  }

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit)
    setOpenLimitMenu(false)
  }

  const handleOpenLimitMenu = (event) => {
    limitAnchorEl.current = event.currentTarget
    setOpenLimitMenu(true)
  }

  const handleCloseLimitMenu = () => {
    setOpenLimitMenu(false)
    limitAnchorEl.current = null
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  if (!data && !data?.tasks && error?.response?.status !== 404)
    return <Spinner />

  return (
    <Box
      sx={{
        px: 3,
        pb: 3,
        height: "100%"
      }}
    >
      <TaskToolBar
        tasks={data?.tasks}
        filters={filters}
        updateFilters={updateFilters}
        clearFilters={clearFilters}
        updateParams={updateParams}
        searchInput={searchInput}
        onSearchInputChange={handleSearchInputChange}
      />
      <TaskList
        tasks={data?.tasks}
        totalPages={data?.total_pages}
        searchInput={searchInput}
        limit={limit}
        page={page}
        limitAnchorEl={limitAnchorEl}
        openLimitMenu={openLimitMenu}
        onLimitChange={handleLimitChange}
        onPageChange={handlePageChange}
        onOpenLimitMenu={handleOpenLimitMenu}
        onCloseLimitMenu={handleCloseLimitMenu}
      />
    </Box>
  )
}
