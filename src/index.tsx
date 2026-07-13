import { createSignal, createEffect, Switch, Match } from "solid-js"
import { render } from "solid-js/web"
import { drills } from "./drills"
import { DrillView } from "./DrillView"
import { MenuView } from "./MenuView"
import { Activity, Navigation, Tool } from "./model"
import { PatternTrainerView } from "./PatternTrainerView"
import { SettingsView } from "./SettingsView"

const tools: Tool[] = [{ id: "pattern-trainer", title: "Pattern Trainer" }]

type AppState =
  | { view: "menu" }
  | { view: "settings" }
  | { view: "activity"; activity: Activity }
  | { view: "unknown"; id: string }

function stateFromSearch(search: string): AppState {
  const params = new URLSearchParams(search)
  if (params.has("settings")) return { view: "settings" }

  const id = params.get("id")
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
  const setAppStateFromSearch = () => setAppState(stateFromSearch(window.location.search))

  createEffect(() => {
    window.addEventListener("popstate", setAppStateFromSearch)
    return () => window.removeEventListener("popstate", setAppStateFromSearch)
  })

  const handleSelectActivity = (activity: Activity) => {
    history.pushState({ fromApp: true }, "", `?id=${activity.id}`)
    setAppStateFromSearch()
  }

  const handleOpenSettings = () => {
    history.pushState({ fromApp: true }, "", "?settings=1")
    setAppStateFromSearch()
  }

  const handleBack = () => {
    if (history.state?.fromApp) {
      history.back()
    } else {
      history.pushState(null, "", window.location.pathname)
      setAppStateFromSearch()
    }
  }

  const nav: Navigation = {
    selectActivity: handleSelectActivity,
    openSettings: handleOpenSettings,
    back: handleBack,
  }

  function mkActivityView(activity: Activity) {
    if (activity.type === "drill") return <DrillView drill={activity} nav={nav} />
    if (activity.id === "pattern-trainer") return <PatternTrainerView nav={nav} />
    return <p>TODO: {activity.title}</p>
  }

  return (
    <Switch>
      <Match when={appState().view === "menu"}>
        <style>{menuCSS}</style>
        <div class="menu-bg">
          <div class="menu-content" style={{ display: "flex", "justify-content": "center" }}>
            <div
              style={{
                padding: "16px",
                width: "100%",
                "max-width": "512px",
                "box-sizing": "border-box",
              }}
            >
              <MenuView drills={drills} tools={tools} nav={nav} />
            </div>
          </div>
        </div>
      </Match>

      <Match when={appState().view === "settings"}>
        <SettingsView nav={nav} />
      </Match>

      <Match when={appState().view === "activity"}>
        {mkActivityView((appState() as { view: "activity"; activity: Activity }).activity)}
      </Match>

      <Match when={appState().view === "unknown"}>
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            "align-items": "center",
            "justify-content": "center",
            gap: "16px",
            "min-height": "100dvh",
            padding: "24px",
          }}
        >
          <p>Unknown drill or tool: {(appState() as { view: "unknown"; id: string }).id}</p>
          <button onClick={nav.back}>← Back</button>
        </div>
      </Match>
    </Switch>
  )
}

render(() => <App />, document.getElementById("root") as HTMLElement)
