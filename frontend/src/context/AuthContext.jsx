import { useFetchUser } from "~/hooks/useQuery"
import { useState, useEffect, useLayoutEffect, createContext } from "react"
import { api } from "~/apis"

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)
  const [refreshTokenExpired, setRefreshTokenExpired] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutSuccess, setLogoutSuccess] = useState(false)

  useLayoutEffect(() => {
    // Request interceptor: attach access token to all requests
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (accessToken)
        config.headers.Authorization = `Bearer ${accessToken}`
      return config
    })

    return () => api.interceptors.request.eject(requestInterceptor)
  }, [accessToken])

  useLayoutEffect(() => {
    let isRefreshing = false
    let queue = []

    const processQueue = (error, token) => {
      queue.forEach(prom => {
        if (token) {
          prom.resolve(token)
        } else {
          prom.reject(error)
        }
      })
      queue = []
    }

    // Response interceptor: refresh access token
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (
          error.response.status === 401 && 
          error.response.data.detail === "Access token expired." &&
          !originalRequest._retry // Check if the request has already been retried
        ) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              queue.push({
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
            const res = await api.post("/auth/refresh")
            const newAccessToken = res["data"]["access_token"]
            setAccessToken(newAccessToken)
            processQueue(null, newAccessToken)
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return api(originalRequest)
          } catch(err) {        
            processQueue(err, null)
            setAccessToken(null)
            setRefreshTokenExpired(true)
            return Promise.reject(err)
          } finally {
            isRefreshing = false
          }
        } 

        return Promise.reject(error)
      } 
    )

    return () => api.interceptors.response.eject(responseInterceptor)
  }, [accessToken])

  const { currentUser, isSuccess } = useFetchUser()
  useEffect(() => {
    if (isSuccess) {
      setUser(currentUser)
      setRefreshTokenExpired(false)
    }
  }, [isSuccess])

  return (
    <AuthContext.Provider 
      value={{ 
        user, setUser,
        accessToken, setAccessToken,
        refreshTokenExpired, setRefreshTokenExpired,
        logoutSuccess, setLogoutSuccess,
        isLoggingOut, setIsLoggingOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
