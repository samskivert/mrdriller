import { Theme, Box } from "@radix-ui/themes"
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
        <>
          <style>{`
            .menu-bg {
              height: 100dvh;
              overflow: auto;
              background-color: white;
              background-image: url('mrdriller.png');
              background-repeat: no-repeat;
            }
            @media (min-width: 1024px) {
              .menu-bg {
                background-position-x: calc(25vw - 256px);
                background-position-y: top;
              }
              .menu-content {
                margin-left: 50vw;
                width: 50vw;
              }
            }
            @media (max-width: 1023px) {
              .menu-bg {
                background-image: none;
              }
            }
          `}</style>
          <div className="menu-bg">
            <div className="menu-content" style={{ display: "flex", justifyContent: "center" }}>
              <Box p="4" style={{ width: "fit-content" }}>
                <MenuView drills={drills} tools={tools} onSelectActivity={handleSelectActivity} />
              </Box>
            </div>
          </div>
        </>
      )}
    </>
  )
}

const root = createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <StrictMode>
    <Theme hasBackground={false}>
      <App />
    </Theme>
  </StrictMode>,
)
