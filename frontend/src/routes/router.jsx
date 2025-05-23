import { createBrowserRouter } from "react-router"
import Login from "~/pages/Login/Login"
import Signup from "~/pages/Signup/Signup"
import Planner from "~/pages/Planner/Planner"
import VerifyEmailReminder from "~/pages/Verification/VerifyEmailReminder/VerifyEmailReminder"
import VerifyEmailStatus from "~/pages/Verification/VerifyEmailStatus/VerifyEmailStatus"
import PasswordResetConfirm from "~/pages/PasswordReset/PasswordResetConfirm/PasswordResetConfirm"
import PasswordResetForm from "~/pages/PasswordReset/PasswordResetForm/PasswordResetForm"
import { PlannerProvider } from "~/context/PlannerContext"


const router = createBrowserRouter([
  {
    path: "/planner",
    element: (
      <PlannerProvider>
        <Planner />
      </PlannerProvider>
    ),
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
