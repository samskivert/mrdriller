import { For } from "solid-js"
import { SettingsButton } from "./components"
import { Drill, Navigation, Tool } from "./model"
import { Flex, Grid, Heading, Button, Box, Separator } from "./ui"

export function MenuView(props: { drills: Drill[]; tools: Tool[]; nav: Navigation }) {
  return (
    <Flex direction="column" gap="6">
      <Flex align="center" justify="between" gap="3">
        <Box style={{ width: "32px", "flex-shrink": 0 }} />
        <Heading
          size="9"
          align="center"
          style={{
            flex: 1,
            color: "#F03564",
            "font-family": "Impact, sans-serif",
            "letter-spacing": "0.15em",
            "text-shadow": `
              -3px -3px 0 #6F2223, 3px -3px 0 #6F2223, -3px 3px 0 #6F2223, 3px 3px 0 #6F2223,
              0 -3px 0 #6F2223, 0 3px 0 #6F2223, -3px 0 0 #6F2223, 3px 0 0 #6F2223,
              -2px -3px 0 #6F2223, 2px -3px 0 #6F2223, -2px 3px 0 #6F2223, 2px 3px 0 #6F2223,
              -3px -2px 0 #6F2223, 3px -2px 0 #6F2223, -3px 2px 0 #6F2223, 3px 2px 0 #6F2223
            `,
          }}
        >
          Mr. Driller
        </Heading>
        <SettingsButton nav={props.nav} style={{ width: "32px" }} />
      </Flex>
      <Grid columns={{ initial: "1", sm: "2" }} gap="4">
        <For each={props.drills}>
          {(drill) => (
            <Button size="4" onClick={() => props.nav.selectActivity({ type: "drill", ...drill })}>
              {drill.title}
            </Button>
          )}
        </For>
      </Grid>
      <Separator size="4" />
      <Grid columns={{ initial: "1", sm: "2" }} gap="4">
        <For each={props.tools}>
          {(tool) => (
            <Button size="4" onClick={() => props.nav.selectActivity({ type: "tool", ...tool })}>
              {tool.title}
            </Button>
          )}
        </For>
      </Grid>
      <div style={{ "text-align": "center", "font-size": "11px", opacity: "0.35" }}>
        {__BUILD_INFO__}
      </div>
    </Flex>
  )
}
