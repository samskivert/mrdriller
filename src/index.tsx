import { Theme, Box, Button, Flex, Text } from "@radix-ui/themes"
import * as React from "react"
import { StrictMode, useState, useEffect } from "react"
import { createRoot } from "react-dom/client"
import "@radix-ui/themes/styles.css"
import { drills } from "./drills"
import { DrillView } from "./DrillView"
import { MenuView } from "./MenuView"
import { Activity, Tool } from "./model"
import { PatternTrainerView } from "./PatternTrainerView"

const tools: Tool[] = [{ id: "pattern-trainer", title: "Pattern Trainer" }]

type AppState =
  | { view: "menu" }
  | { view: "activity"; activity: Activity }
  | { view: "unknown"; id: string }

function stateFromSearch(search: string): AppState {
  const id = new URLSearchParams(search).get("id")
  if (!id) return { view: "menu" }

  const drill = drills.find((d) => d.id === id)
  if (drill) return { view: "activity", activity: { type: "drill", ...drill } }

  const tool = tools.find((t) => t.id === id)
  if (tool) return { view: "activity", activity: { type: "tool", ...tool } }

  return { view: "unknown", id }
}

function App() {
  const [appState, setAppState] = useState<AppState>(() =>
    stateFromSearch(window.location.search),
  )

  useEffect(() => {
    const onPopState = () => setAppState(stateFromSearch(window.location.search))
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  const handleSelectActivity = (activity: Activity) => {
    history.pushState({ fromApp: true }, "", `?id=${activity.id}`)
    setAppState({ view: "activity", activity })
  }

  const handleBack = () => {
    if (history.state?.fromApp) {
      history.back()
    } else {
      history.pushState(null, "", window.location.pathname)
      setAppState({ view: "menu" })
    }
  }

  function mkView(activity: Activity) {
    if (activity.type === "drill") {
      return <DrillView drill={activity} onBack={handleBack} />
    } else {
      if (activity.id === "pattern-trainer") {
        return <PatternTrainerView onBack={handleBack} />
      }
      return <p>TODO: ${activity.title}</p>
    }
  }

  if (appState.view === "activity") {
    return mkView(appState.activity)
  }

  if (appState.view === "unknown") {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        gap="4"
        style={{ minHeight: "100dvh", padding: "24px" }}
      >
        <Text size="5">Unknown drill or tool: {appState.id}</Text>
        <Button
          variant="soft"
          onClick={() => {
            history.pushState(null, "", window.location.pathname)
            setAppState({ view: "menu" })
          }}
        >
          ← Back
        </Button>
      </Flex>
    )
  }

  return (
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
