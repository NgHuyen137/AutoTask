import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createNewTaskAPI,
  updateTaskAPI,
  updateMultipleTasksAPI,
  deleteTaskAPI,
  deleteMultipleTasksAPI,
  createNewSchedulingHourAPI,
  updateSchedulingHourAPI,
  deleteSchedulingHourAPI,
  createNewAccountAPI,
  loginAPI,
  sendEmailVerificationAPI,
  sendPasswordResetEmailAPI,
  resetPasswordAPI,
  logoutAPI,
  refreshAccessTokenAPI
} from "~/apis"

export const useCreateNewSchedulingHour = () => {
  const queryClient = useQueryClient()

  const {
    mutate: createNewSchedulingHour,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: (newSchedulingHourData) =>
      createNewSchedulingHourAPI(newSchedulingHourData),
    onSuccess: (data) => {
      queryClient.setQueryData(["schedulingHours"], (oldData = []) => [
        ...oldData,
        data
      ])
    }
  })

  return {
    createNewSchedulingHour,
    isLoading,
    isSuccess,
    reset
  }
}

export const useUpdateSchedulingHour = () => {
  const queryClient = useQueryClient()

  const {
    mutate: updateSingleSchedulingHour,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: ({ id, updatedSchedulingHourData }) =>
      updateSchedulingHourAPI(id, updatedSchedulingHourData),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["schedulingHours"], (oldData) => {
        if (!oldData) return oldData
        return oldData.map((schedulingHour) =>
          schedulingHour._id === variables.id ? data : schedulingHour
        )
      })
    }
  })

  return {
    updateSingleSchedulingHour,
    isLoading,
    isSuccess,
    reset
  }
}

export const useDeleteSchedulingHour = () => {
  const queryClient = useQueryClient()

  const {
    mutate: deleteSingleSchedulingHour,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: ({ id }) => deleteSchedulingHourAPI(id),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["schedulingHours"], (oldData) => {
        if (!oldData) return oldData
        return oldData.filter(
          (schedulingHour) => schedulingHour._id !== variables.id
        )
      })
    }
  })

  return {
    deleteSingleSchedulingHour,
    isLoading,
    isSuccess,
    reset
  }
}

export const useCreateNewTask = () => {
  const queryClient = useQueryClient()

  const {
    mutate: createNewTask,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: (newTaskData) => createNewTaskAPI(newTaskData),
    onSuccess: () => {
      // Invalidate queries to refetch from the server
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        exact: false
      })
    }
  })

  return {
    createNewTask,
    isSuccess,
    isLoading,
    reset
  }
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  const {
    mutate: updateSingleTask,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: ({ id, updatedTaskData }) => updateTaskAPI(id, updatedTaskData),
    onSuccess: () => {
      // Invalidate queries to refetch from the server
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        exact: false
      })
    }
  })

  return {
    updateSingleTask,
    isLoading,
    isSuccess,
    reset
  }
}

export const useUpdateMultipleTasks = () => {
  const queryClient = useQueryClient()

  const {
    mutate: updateMultipleTasks,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: ({ ids, updatedTaskData }) =>
      updateMultipleTasksAPI(ids, updatedTaskData),
    onSuccess: () => {
      // Invalidate queries to refetch from the server
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        exact: false
      })
    }
  })

  return {
    updateMultipleTasks,
    isLoading,
    isSuccess,
    reset
  }
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  const {
    mutate: deleteSingleTask,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: ({ id }) => deleteTaskAPI(id),
    onSuccess: () => {
      // Invalidate queries to refetch from the server
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        exact: false
      })
    }
  })

  return {
    deleteSingleTask,
    isLoading,
    isSuccess,
    reset
  }
}

export const useDeleteMultipleTasks = () => {
  const queryClient = useQueryClient()

  const {
    mutate: deleteMultipleTasks,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: (ids) => deleteMultipleTasksAPI(ids),
    onSuccess: () => {
      // Invalidate queries to refetch from the server
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        exact: false
      })
    }
  })

  return {
    deleteMultipleTasks,
    isLoading,
    isSuccess,
    reset
  }
}

export const useCreateNewAccount = () => {
  const {
    mutate: createNewAccount,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: (newAccountData) => createNewAccountAPI(newAccountData)
  })

  return {
    createNewAccount,
    isLoading,
    isSuccess,
    reset
  }
}

export const useLogin = () => {
  const {
    mutate: loginAccount,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: (loginData) => loginAPI(loginData)
  })

  return {
    loginAccount,
    isLoading,
    isSuccess,
    reset
  }
}

export const useSendEmailVerification = () => {
  const {
    mutate: sendEmailVerification,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: (data) => sendEmailVerificationAPI(data)
  })

  return {
    sendEmailVerification,
    isLoading,
    isSuccess,
    reset
  }
}

export const useSendPasswordResetEmail = () => {
  const {
    mutate: sendPasswordResetEmail,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: (data) => sendPasswordResetEmailAPI(data)
  })

  return {
    sendPasswordResetEmail,
    isLoading,
    isSuccess,
    reset
  }
}

export const useResetPassword = () => {
  const {
    mutate: resetPassword,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: (data) => resetPasswordAPI(data)
  })

  return {
    resetPassword,
    isLoading,
    isSuccess,
    reset
  }
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  const {
    mutate: logout,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: () => logoutAPI(),
    onSuccess: () => {
      queryClient.removeQueries(["users"])
      queryClient.removeQueries(["tasks"])
      queryClient.removeQueries(["schedulingHours"])
      queryClient.removeQueries(["verifyTokens"])
      queryClient.removeQueries(["resetTokens"])
    }
  })

  return {
    logout,
    isLoading,
    isSuccess,
    reset
  }
}

export const useRefreshAccessToken = () => {
  const {
    mutate: refreshAccessToken,
    isLoading,
    isSuccess,
    error,
    reset
  } = useMutation({
    mutationFn: () => refreshAccessTokenAPI()
  })

  return {
    refreshAccessToken,
    isLoading,
    isSuccess,
    error,
    reset
  }
}
