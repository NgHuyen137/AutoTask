import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"

export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    status: null,
    priority: null,
    tags: null,
    range_type: null,
    from_date: null,
    to_date: null,
    sort_by: "due_date"
  })

  useEffect(() => {
    const paramsObject = Object.fromEntries(searchParams.entries())
    paramsObject["status"] =
      paramsObject["status"] !== null ? parseInt(paramsObject["status"]) : null
    paramsObject["priority"] =
      paramsObject["priority"] !== null
        ? parseInt(paramsObject["priority"])
        : null
    setFilters((prev) => ({ ...prev, ...paramsObject }))
  }, [searchParams])

  const updateFilters = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const clearFilters = () => {
    setFilters({
      status: null,
      priority: null,
      tags: null,
      range_type: null,
      from_date: null,
      to_date: null,
      sort_by: "due_date"
    })
  }

  const getParam = (field) => {
    return searchParams.get(field)
  }

  const updateParams = (newFilters) => {
    const currentParams = Object.fromEntries(searchParams.entries())
    const newParams = { ...currentParams, ...newFilters }

    // Remove keys with empty/null/undefined values
    Object.keys(newParams).forEach((key) => {
      const value = newParams[key]
      if (
        !value &&
        value !== 0 // keep 0 as valid value
      ) {
        delete newParams[key]
      }
    })

    setSearchParams(newParams)
  }

  return {
    filters,
    updateFilters,
    clearFilters,
    searchParams,
    getParam,
    updateParams
  }
}
