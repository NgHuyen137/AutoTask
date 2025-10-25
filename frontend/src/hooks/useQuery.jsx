import { useQuery } from "@tanstack/react-query"
import {
  fetchUserAPI,
  verifyEmailAPI,
  verifyPasswordResetTokenAPI,
  fetchAllSchedulingHoursAPI,
  fetchAllTasksAPI,
  fetchTaskByIdAPI
} from "~/apis"
import { usePlannerContext } from "~/hooks/useContext"

// For Scheduling Hour
export const useFetchAllSchedulingHours = () => {
  const { data: schedulingHours = null } = useQuery({
    queryKey: ["schedulingHours"],
    queryFn: () => fetchAllSchedulingHoursAPI(),
    retry: false
  })

  return schedulingHours
}

// For Task
export const useFetchAllTasks = (filters = {}) => {
  const { startOfWeek, endOfWeek } = usePlannerContext()

  if (startOfWeek && endOfWeek) {
    const { data, error } = useQuery({
      queryKey: ["tasks", { startOfWeek, endOfWeek }],
      queryFn: () =>
        fetchAllTasksAPI({
          start_of_week: startOfWeek,
          end_of_week: endOfWeek
        }),
      enabled: startOfWeek !== "" && endOfWeek !== "",
      retry: false
    })
    return { data, error }
  } else {
    const { data, error } = useQuery({
      queryKey: ["tasks", { filters }],
      queryFn: () => fetchAllTasksAPI(filters),
      retry: false,
      cacheTime: 0, // disables cache
      staleTime: 0, // always consider data stale
      refetchOnWindowFocus: false,
      refetchOnMount: true // always fetch on mount
    })
    return { data, error }
  }
}

export const useFetchTaskById = (id) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => fetchTaskByIdAPI(id),
    enabled: !!id,
    retry: false,
    cacheTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  })
}

// For User
export const useFetchUser = () => {
  const { data: currentUser, isSuccess } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUserAPI(),
    retry: false
  })

  return {
    currentUser,
    isSuccess
  }
}

export const useVerifyEmail = (verifyToken) => {
  const { data: verifyResponse } = useQuery({
    queryKey: ["verifyTokens", verifyToken],
    queryFn: () => verifyEmailAPI(verifyToken),
    enabled: !!verifyToken,
    retry: false
  })

  return verifyResponse
}

export const useVerifyPasswordResetToken = (resetToken) => {
  const {
    data: verifyResponse,
    isLoading,
    isSuccess
  } = useQuery({
    queryKey: ["resetTokens", resetToken],
    queryFn: () => verifyPasswordResetTokenAPI(resetToken),
    enabled: !!resetToken,
    retry: false
  })

  return {
    verifyResponse,
    isLoading,
    isSuccess
  }
}
