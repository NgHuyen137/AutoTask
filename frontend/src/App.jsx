import GlobalStyles from "@mui/material/GlobalStyles"
import Planner from "./pages/Planner/Planner"
import { PlannerProvider } from "./context/PlannerContext"

function App() {
  return (
    <>
      <GlobalStyles
        styles={{ body: { margin: 0, padding: 0, overflow: "hidden" } }}
      />
    </>
  )
}

export default App
