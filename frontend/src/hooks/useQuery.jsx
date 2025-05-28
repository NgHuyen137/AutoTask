import validator from "validator"
import { useQuery } from "@tanstack/react-query"
import { 
  fetchUserAPI,
  verifyEmailAPI,
  verifyPasswordResetTokenAPI,
  fetchAllSchedulingHoursAPI, 
  fetchAllTasksAPI
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
export const useFetchAllTasks = () => {
  const { startOfWeek, endOfWeek } = usePlannerContext()

  const { data: tasks } = useQuery({
    queryKey: ["tasks", { startOfWeek, endOfWeek }],
    queryFn: () => fetchAllTasksAPI(startOfWeek, endOfWeek),
    enabled: startOfWeek !== "" && endOfWeek !== "",
    retry: false
  })

  return tasks
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
  const { data: verifyResponse, isLoading, isSuccess } = useQuery({
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
