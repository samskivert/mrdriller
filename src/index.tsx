import { Theme, Container, Box } from "@radix-ui/themes"
import * as React from "react"
import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import "@radix-ui/themes/styles.css"
import { drills } from "./drills"
import { DrillView } from "./DrillView"
import { MenuView } from "./MenuView"
import { Drill } from "./model"

function App() {
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null)

  const handleSelectDrill = (drill: Drill) => {
    setSelectedDrill(drill)
  }

  const handleBackToMenu = () => {
    setSelectedDrill(null)
  }

  return (
    <>
      {selectedDrill ? (
        <DrillView drill={selectedDrill} onBack={handleBackToMenu} />
      ) : (
        <Container size="4" p="4" style={{ height: "100dvh", overflow: "auto" }}>
          <Box style={{ width: "fit-content", margin: "0 auto" }}>
            <MenuView drills={drills} onSelectDrill={handleSelectDrill} />
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
