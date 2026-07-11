import { For } from "solid-js"
import { Flex, Grid, Heading, Button, Separator } from "./ui"
import { Activity, Drill, Tool } from "./model"

export function MenuView(props: {
  drills: Drill[]
  tools: Tool[]
  onSelectActivity: (activity: Activity) => void
}) {
  return (
    <Flex direction="column" gap="6">
      <Heading
        size="9"
        align="center"
        style={{
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
      <Grid columns={{ initial: "1", sm: "2" }} gap="4">
        <For each={props.drills}>
          {(drill) => (
            <Button
              size="4"
              onClick={() => props.onSelectActivity({ type: "drill", ...drill })}
            >
              {drill.title}
            </Button>
          )}
        </For>
      </Grid>
      <Separator size="4" />
      <Grid columns={{ initial: "1", sm: "2" }} gap="4">
        <For each={props.tools}>
          {(tool) => (
            <Button
              size="4"
              onClick={() => props.onSelectActivity({ type: "tool", ...tool })}
            >
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
