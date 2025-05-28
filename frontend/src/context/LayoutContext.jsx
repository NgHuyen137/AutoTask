import { useState, createContext } from "react"

export const LayoutContext = createContext({})

export const LayoutProvider = ({ children }) => {
  const [sidebarMounted, setSidebarMounted] = useState(false)
  const [openSidebar, setOpenSidebar] = useState(() => {
    return JSON.parse(localStorage.getItem("openSidebar")) ?? false
  })
  const [lockSidebar, setLockSidebar] = useState(() => {
    return JSON.parse(localStorage.getItem("lockSidebar")) ?? false
  })
  const [hoverPin, setHoverPin] = useState(() => {
    return JSON.parse(localStorage.getItem("hoverPin")) ?? false
  })

  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutSuccess, setLogoutSuccess] = useState(false)
  const [isLoggedOut, setIsLoggedOut] = useState(false)

  return (
    <LayoutContext.Provider
      value={{
        sidebarMounted, setSidebarMounted,
        openSidebar, setOpenSidebar,
        lockSidebar, setLockSidebar,
        hoverPin, setHoverPin,
        logoutSuccess, setLogoutSuccess,
        isLoggingOut, setIsLoggingOut,
        isLoggedOut, setIsLoggedOut
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}
