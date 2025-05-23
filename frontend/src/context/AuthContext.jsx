import { useState, createContext } from "react"

let tokenGetter = () => null
let tokenSetter = (newAccessToken) => null

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null)

  tokenGetter = () => accessToken
  tokenSetter = (newAccessToken) => setAccessToken(newAccessToken)

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const getAccessToken = () => tokenGetter()
export const setNewAccessToken = (newAccessToken) => tokenSetter(newAccessToken)
