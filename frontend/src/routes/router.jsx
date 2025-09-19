import { createBrowserRouter, Navigate } from "react-router-dom"
import { useAuthContext } from "~/hooks/useContext"
import { PlannerProvider } from "~/context/PlannerContext"
import { SchedulingHourProvider } from "~/context/SchedulingHourContext"

import Login from "~/pages/Login/Login"
import Signup from "~/pages/Signup/Signup"
import Planner from "~/pages/Planner/Planner"
import SchedulingHours from "~/pages/SchedulingHours/SchedulingHours"
import VerifyEmailReminder from "~/pages/Verification/VerifyEmailReminder/VerifyEmailReminder"
import VerifyEmailStatus from "~/pages/Verification/VerifyEmailStatus/VerifyEmailStatus"
import PasswordResetConfirm from "~/pages/PasswordReset/PasswordResetConfirm/PasswordResetConfirm"
import PasswordResetForm from "~/pages/PasswordReset/PasswordResetForm/PasswordResetForm"

const ProtectedRoute = ({ children }) => {
  const { refreshTokenExpired } = useAuthContext()

  if (refreshTokenExpired)
    return <Navigate to="/login" replace={true} />
  return children
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Navigate to="/planner" replace />
    )
  },
  {
    path: "/planner",
    element: (
      <ProtectedRoute>
        <PlannerProvider>
          <Planner />
        </PlannerProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/scheduling-hours",
    element: (
      <ProtectedRoute>
        <SchedulingHourProvider>
          <SchedulingHours />
        </SchedulingHourProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/verify",
    element: <VerifyEmailReminder />
  },
  {
    path: "/verify/:verifyToken",
    element: <VerifyEmailStatus />
  },
  {
    path: "/forgot-password",
    element: <PasswordResetConfirm />
  },
  {
    path: "/forgot-password/:resetToken",
    element: <PasswordResetForm />
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  }
])

export default router
