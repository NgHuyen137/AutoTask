import { useState, useEffect, useRef } from "react"

export const useDelayRedirect = (isSuccess, setShouldRedirect) => {
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (isSuccess && !hasStarted) {
      setHasStarted(true)

      // Delay for 3 seconds before redirect
      const timeout = setTimeout(() => {
        setShouldRedirect(true)
      }, 3000)

      return () => clearTimeout(timeout)
    }
  }, [isSuccess, hasStarted])
}

export const useScreenSize = () => {
  // Custom hook to track the screen size
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResizeScreen = () => {
      setScreenWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResizeScreen) // Listen when screen size changes
    return () => window.removeEventListener("resize", handleResizeScreen)
  }, [])

  return screenWidth
}

export const useCalendarView = (
  calendarRef,
  calendarContainerRef,
  setCalendarView,
  calendarScreenWidthThreshold
) => {
  // Custom hook to change calendar view based on screen size & task sidebar width
  useEffect(() => {
    if (!calendarRef.current || !calendarContainerRef.current) return

    const observer = new ResizeObserver(() => {
      const newCalendarView =
        calendarContainerRef.current.offsetWidth <= calendarScreenWidthThreshold
          ? "timeGridDay"
          : "timeGridWeek"
      queueMicrotask(() => {
        const calendarApi = calendarRef.current.getApi()
        if (calendarApi.view.type !== newCalendarView) {
          calendarApi.changeView(newCalendarView)
          setCalendarView(newCalendarView)
        }
      })
    })

    observer.observe(calendarContainerRef.current)
    return () => observer.disconnect()
  }, [])
}

export const useEffectAfterMount = (effect, dependencies) => {
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    return effect()
  }, dependencies)
}

export const useClickOutsideMoreOptionsPopper = (
  moreOptionsAnchor,
  moreOptionsPaperRef,
  setOpenMoreOptions,
  openDeleteDialog
) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !moreOptionsPaperRef.current?.contains(event.target) &&
        !moreOptionsAnchor.current?.contains(event.target) &&
        !openDeleteDialog
      )
        setOpenMoreOptions(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openDeleteDialog])
}
