import { createBrowserRouter, Navigate } from "react-router-dom"
import { useAuthContext } from "~/hooks/useContext"
import { PlannerProvider } from "~/context/PlannerContext"
import { SchedulingHourProvider } from "~/context/SchedulingHourContext"

import MainLayout from "~/layouts/MainLayout"
import Login from "~/pages/Login/Login"
import Signup from "~/pages/Signup/Signup"
import Tasks from "~/pages/Tasks/Tasks"
import TaskID from "~/pages/Tasks/_id"
import Planner from "~/pages/Planner/Planner"
import Analytics from "~/pages/Analytics/Analytics"
import SchedulingHours from "~/pages/SchedulingHours/SchedulingHours"
import VerifyEmailReminder from "~/pages/Verification/VerifyEmailReminder/VerifyEmailReminder"
import VerifyEmailStatus from "~/pages/Verification/VerifyEmailStatus/VerifyEmailStatus"
import PasswordResetConfirm from "~/pages/PasswordReset/PasswordResetConfirm/PasswordResetConfirm"
import PasswordResetForm from "~/pages/PasswordReset/PasswordResetForm/PasswordResetForm"
import TaskUpdate from "~/pages/Tasks/TaskUpdate"
import NotFound from "~/pages/NotFound/NotFound"

const ProtectedRoute = ({ children }) => {
  const { refreshTokenExpired } = useAuthContext()

  if (refreshTokenExpired) return <Navigate to="/login" replace={true} />
  return children
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/planner" replace />
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/planner",
        element: (
          <PlannerProvider>
            <Planner />
          </PlannerProvider>
        )
      },
      {
        path: "/tasks",
        element: <Tasks />
      },
      {
        path: "/tasks/:id",
        element: <TaskID />
      },
      {
        path: "/tasks/:id/edit",
        element: <TaskUpdate />
      },
      {
        path: "/analytics",
        element: <Analytics />
      },
      {
        path: "/scheduling-hours",
        element: (
          <SchedulingHourProvider>
            <SchedulingHours />
          </SchedulingHourProvider>
        )
      }
    ]
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
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "*",
    element: <NotFound />
  }
])

export default router
