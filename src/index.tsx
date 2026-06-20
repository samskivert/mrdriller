import { createSignal, createEffect, Switch, Match } from "solid-js"
import { render } from "solid-js/web"
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

const menuCSS = `
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
    .menu-bg { background-image: none; }
  }
`

function App() {
  const [appState, setAppState] = createSignal<AppState>(stateFromSearch(window.location.search))

  createEffect(() => {
    const onPopState = () => setAppState(stateFromSearch(window.location.search))
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  })

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

  function mkActivityView(activity: Activity) {
    if (activity.type === "drill") return <DrillView drill={activity} onBack={handleBack} />
    if (activity.id === "pattern-trainer") return <PatternTrainerView onBack={handleBack} />
    return <p>TODO: {activity.title}</p>
  }

  return (
    <Switch>
      <Match when={appState().view === "menu"}>
        <style>{menuCSS}</style>
        <div class="menu-bg">
          <div class="menu-content" style={{ display: "flex", "justify-content": "center" }}>
            <div style={{ padding: "16px", width: "100%", "max-width": "512px", "box-sizing": "border-box" }}>
              <MenuView drills={drills} tools={tools} onSelectActivity={handleSelectActivity} />
            </div>
          </div>
        </div>
      </Match>

      <Match when={appState().view === "activity"}>
        {mkActivityView((appState() as { view: "activity"; activity: Activity }).activity)}
      </Match>

      <Match when={appState().view === "unknown"}>
        <div style={{ display: "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", gap: "16px", "min-height": "100dvh", padding: "24px" }}>
          <p>Unknown drill or tool: {(appState() as { view: "unknown"; id: string }).id}</p>
          <button onClick={() => { history.pushState(null, "", window.location.pathname); setAppState({ view: "menu" }) }}>
            ← Back
          </button>
        </div>
      </Match>
    </Switch>
  )
}

render(() => <App />, document.getElementById("root") as HTMLElement)
