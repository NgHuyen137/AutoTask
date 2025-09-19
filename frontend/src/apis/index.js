import axios from "axios"
import { API_ROOT } from "~/utils/constants.js"

export const api = axios.create({
  baseURL: `${API_ROOT}/api/v1`,
  withCredentials: true // Allow to include Cookies in each request
})


// For Scheduling Hour
export const fetchAllSchedulingHoursAPI = async () => {
  const response = await api.get("/schedulingHours")
  return response.data
}

export const createNewSchedulingHourAPI = async (newSchedulingHourData) => {
  const response = await api.post("/schedulingHours", newSchedulingHourData)
  return response.data
}

export const updateSchedulingHourAPI = async (id, updatedSchedulingHourData) => {
  const response = await api.put(`/schedulingHours/${id}`, updatedSchedulingHourData)
  return response.data
}

export const deleteSchedulingHourAPI = async (id) => {
  const response = await api.delete(`/schedulingHours/${id}`)
  return response.data
}


// For Task
export const fetchAllTasksAPI = async (start_of_week, end_of_week) => {
  const response = await api.get("/tasks", {
    params: {
      start_of_week,
      end_of_week
    },
    headers: { "Content-Type": "application/json" }
  })
  return response.data
}

export const createNewTaskAPI = async (newTaskData) => {
  const response = await api.post("/tasks", newTaskData)
  return response.data
}

export const updateTaskAPI = async (id, updatedTaskData) => {
  const response = await api.put(`/tasks/${id}`, updatedTaskData)
  return response.data
}

export const deleteTaskAPI = async (id) => {
  const response = await api.delete(`/tasks/${id}`)
  return response.data
}

// For User
export const fetchUserAPI = async () => {
  const response = await api.get("/users/me")
  return response.data
}

export const createNewAccountAPI = async (newAccountData) => {
  const response = await api.post("/auth/signup", newAccountData)
  return response.data
} 

export const loginAPI = async (formData) => {
  const response = await api.post(
    "/auth/login/password", 
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  )
  return response.data
} 

export const verifyEmailAPI = async (token) => {
  const response = await api.get(`/auth/verify/${token}`)
  return response.data
}

export const sendEmailVerificationAPI = async (data) => {
  const response = await api.post("/auth/send-verification-email", data)
  return response.data
}

export const sendPasswordResetEmailAPI = async (data) => {
  const response = await api.post("/auth/confirm-password-reset", data)
  return response.data
}

export const verifyPasswordResetTokenAPI = async (token) => {
  const response = await api.get(`/auth/confirm-password-reset/${token}`)
  return response.data
}

export const resetPasswordAPI = async (data) => {
  const response = await api.post("/auth/reset-password", data)
  return response.data
}

export const logoutAPI = async () => {
  const response = await api.post("/auth/logout")
  return response.data
}

export const refreshAccessTokenAPI = async () => {
  const response = await api.post("/auth/refresh")
  return response.data
}
