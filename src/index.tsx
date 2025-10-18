import * as React from "react"
import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import { Drill } from "./model"
import { MenuView, PracticeView } from "./view"
import { drills } from "./drills"

function App() {
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null)

  const handleSelectDrill = (drill: Drill) => {
    setSelectedDrill(drill)
  }

  const handleBackToMenu = () => {
    setSelectedDrill(null)
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "fit-content",
        }}
      >
        {selectedDrill ? (
          <PracticeView drill={selectedDrill} onBack={handleBackToMenu} />
        ) : (
          <MenuView drills={drills} onSelectDrill={handleSelectDrill} />
        )}
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
