import axios from "axios"
import { API_ROOT } from "~/utils/constants.js"
import { getAccessToken, setNewAccessToken } from "../context/AuthContext"

const api = axios.create({
  baseURL: `${API_ROOT}/api/v1`,
  withCredentials: true // Allow to include Cookies in each request
})

// Request interceptor: attach access token to all requests
api.interceptors.request.use((config) => {
  const accessToken = getAccessToken()
  if (accessToken)
    config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

// Response interceptor: refresh access token
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response.status === 401 && 
      error.response.data.detail === "Not authenticated" &&
      !originalRequest._retry // Check if the request has already been retried
    ) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            reject: (err) => reject(err)
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      // Create a new access token using the refresh token & retry the request
      try { 
        const res = await api.post("/refresh")
        const newAccessToken = res.data["access_token"]
        setNewAccessToken(newAccessToken)

        isRefreshing = false
        processQueue(null, newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch(err) {
        isRefreshing = false
        setNewAccessToken(null)
        processQueue(err, null)
        return Promise.reject(err)
      }
    } 

    return Promise.reject(error)
  } 
)


// For Scheduling Hour
export const fetchAllSchedulingHoursAPI = async () => {
  const response = await api.get("/schedulingHours")
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
export const fetchUserByEmailAPI = async (email) => {
  const response = await api.get("/users", {
    params: { email }
  })
  return response.data
}

export const createNewAccountAPI = async (newAccountData) => {
  const response = await api.post("/auth/signup", newAccountData)
  return response.data
} 

export const loginAPI = async (formData) => {
  const response = await api.post(
    "/auth/login", 
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
