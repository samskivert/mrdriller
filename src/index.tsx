import * as React from "react"
import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import { Theme, Container, Box } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"
import { Drill } from "./model"
import { PracticeView } from "./PracticeView"
import { MenuView } from "./MenuView"
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
    <Container size="4" p="4">
      <Box style={{ width: "fit-content", margin: "0 auto" }}>
        {selectedDrill ? (
          <PracticeView drill={selectedDrill} onBack={handleBackToMenu} />
        ) : (
          <MenuView drills={drills} onSelectDrill={handleSelectDrill} />
        )}
      </Box>
    </Container>
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
