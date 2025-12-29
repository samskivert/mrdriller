import { Theme, Container, Box } from "@radix-ui/themes"
import * as React from "react"
import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import "@radix-ui/themes/styles.css"
import { drills } from "./drills"
import { DrillView } from "./DrillView"
import { MenuView } from "./MenuView"
import { Activity, Tool } from "./model"
import { PatternTrainerView } from "./PatternTrainerView"

const tools: Tool[] = [{ id: "pattern-trainer", title: "Pattern Trainer" }]

function App() {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  const handleSelectActivity = (activity: Activity) => {
    setSelectedActivity(activity)
  }

  const handleBackToMenu = () => {
    setSelectedActivity(null)
  }

  function mkView(activity: Activity) {
    if (activity.type === "drill") {
      return <DrillView drill={activity} onBack={handleBackToMenu} />
    } else {
      if (activity.id === "pattern-trainer") {
        return <PatternTrainerView onBack={handleBackToMenu} />
      }
      return <p>TODO: ${activity.title}</p>
    }
  }

  return (
    <>
      {selectedActivity ? (
        mkView(selectedActivity)
      ) : (
        <Container size="4" p="4" style={{ height: "100dvh", overflow: "auto" }}>
          <Box style={{ width: "fit-content", margin: "0 auto" }}>
            <MenuView drills={drills} tools={tools} onSelectActivity={handleSelectActivity} />
          </Box>
        </Container>
      )}
    </>
  )
}

const root = createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <StrictMode>
    <Theme>
      <App />
    </Theme>
  </StrictMode>,
)
