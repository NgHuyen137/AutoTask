import { useContext } from "react"
import { PlannerContext } from "~/context/PlannerContext"
import { LayoutContext } from "~/context/LayoutContext"
import { AuthContext } from "~/context/AuthContext"
import { SchedulingHourContext } from "~/context/SchedulingHourContext"

export const usePlannerContext = () => useContext(PlannerContext)
export const useLayoutContext = () => useContext(LayoutContext)
export const useAuthContext = () => useContext(AuthContext)
export const useSchedulingHourContext = () => useContext(SchedulingHourContext)
