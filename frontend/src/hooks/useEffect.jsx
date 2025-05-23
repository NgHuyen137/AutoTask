import { useState, useEffect } from "react"

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
