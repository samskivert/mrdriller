import { Button, Flex, Grid, Heading, Separator } from "@radix-ui/themes"
import * as React from "react"
import { Activity, Drill, Tool } from "./model"

export function MenuView({
  drills,
  tools,
  onSelectActivity,
}: {
  drills: Drill[]
  tools: Tool[]
  onSelectActivity: (activity: Activity) => void
}) {
  return (
    <Flex direction="column" gap="6">
      <Heading
        align="center"
        size="9"
        style={{
          color: "#F03564",
          fontFamily: "Impact, sans-serif",
          letterSpacing: "0.15em",
          textShadow: `
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
        {drills.map((drill) => (
          <Button
            key={drill.id}
            onClick={() => onSelectActivity({ type: "drill", ...drill })}
            size="4"
          >
            {drill.title}
          </Button>
        ))}
      </Grid>
      <Separator size="4" />
      <Grid columns={{ initial: "1", sm: "2" }} gap="4">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            onClick={() => onSelectActivity({ type: "tool", ...tool })}
            size="4"
          >
            {tool.title}
          </Button>
        ))}
      </Grid>
    </Flex>
  )
}
