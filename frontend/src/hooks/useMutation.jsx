import { useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  createNewTaskAPI, 
  updateTaskAPI, 
  deleteTaskAPI,
  createNewAccountAPI,
  loginAPI,
  sendEmailVerificationAPI,
  sendPasswordResetEmailAPI,
  resetPasswordAPI
} from "~/apis"
import { usePlannerContext } from "~/hooks/useContext"

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
      queryClient.setQueryData(queryKey, (oldData = []) => [...oldData, data])
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
        (oldData) => oldData.filter((task) => task._id !== variables.id)
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
