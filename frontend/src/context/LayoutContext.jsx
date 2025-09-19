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

  // For showing Task Create Form when clicking on the New Task button
  const [enterTaskCreateForm, setEnterTaskCreateForm] = useState(false)
  const [showTaskCreateForm, setShowTaskCreateForm] = useState(false)

  return (
    <LayoutContext.Provider
      value={{
        sidebarMounted, setSidebarMounted,
        openSidebar, setOpenSidebar,
        lockSidebar, setLockSidebar,
        hoverPin, setHoverPin,
        enterTaskCreateForm, setEnterTaskCreateForm,
        showTaskCreateForm, setShowTaskCreateForm
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}
