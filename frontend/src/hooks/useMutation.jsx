import { useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  createNewTaskAPI, 
  updateTaskAPI, 
  deleteTaskAPI,
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
import { usePlannerContext } from "~/hooks/useContext"

export const useCreateNewSchedulingHour = () => {
  const queryClient = useQueryClient()

  const {
    mutate: createNewSchedulingHour,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: (newSchedulingHourData) => createNewSchedulingHourAPI(newSchedulingHourData),
    onSuccess: (data) => {
      queryClient.setQueryData(["schedulingHours"], (oldData = []) => [...oldData, data])
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
    mutationFn: ({ id, updatedSchedulingHourData }) => updateSchedulingHourAPI(id, updatedSchedulingHourData),
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
        return oldData.filter((schedulingHour) => schedulingHour._id !== variables.id)
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
  const { startOfWeek, endOfWeek } = usePlannerContext()

  const {
    mutate: createNewTask,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: (newTaskData) => createNewTaskAPI(newTaskData),
    onSuccess: (data) => {
      const queryKey = ["tasks", { startOfWeek, endOfWeek }]
      queryClient.setQueryData(queryKey, (oldData = []) => {
        if (!oldData) return [data]
        return [...oldData, data]
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
  const { startOfWeek, endOfWeek } = usePlannerContext()

  const {
    mutate: updateSingleTask,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: ({ id, updatedTaskData }) => updateTaskAPI(id, updatedTaskData),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["tasks", { startOfWeek, endOfWeek }],
        (oldData) => {
          if (!oldData) return oldData
          return oldData.map((task) =>
            task._id === variables.id ? data.updated_task : task
          )
        }
      )
    }
  })

  return {
    updateSingleTask,
    isLoading,
    isSuccess,
    reset
  }
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  const { startOfWeek, endOfWeek } = usePlannerContext()

  const {
    mutate: deleteSingleTask,
    isLoading,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: ({ id }) => deleteTaskAPI(id),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["tasks", { startOfWeek, endOfWeek }],
        (oldData) => {
          let updatedTasks = oldData.filter((task) => task._id !== variables.id)

          if (data.updated_overdue_tasks) {
            const updatedOverdueTaskIds = 
              data.updated_overdue_tasks.map(updated_overdue_task => updated_overdue_task._id)
            updatedTasks = updatedTasks.map((task) =>
              updatedOverdueTaskIds.includes(task._id) ? 
                data.updated_overdue_tasks.find(updated_overdue_task => updated_overdue_task._id === task._id) : 
                task
            )
          }

          return updatedTasks
        }
      )
    }
  })

  return {
    deleteSingleTask,
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
