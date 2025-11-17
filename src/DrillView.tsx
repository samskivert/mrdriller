import { Button, Flex, Heading } from "@radix-ui/themes"
import * as React from "react"
import { DrillOverView } from "./DrillOverviewView"
import { Drill } from "./model"
import { PracticeView } from "./PracticeView"

export function DrillView({ drill, onBack }: { drill: Drill; onBack: () => void }) {
  const [view, setView] = React.useState<"practice" | "overview">("practice")

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
      {view === "practice" ? (
        <>
          <Flex align="center" justify="between" wrap="wrap" gap="3">
            <Button variant="soft" onClick={onBack} style={{ flexShrink: 0 }}>
              ← Back
            </Button>
            <Heading size="6" style={{ flex: 1, textAlign: "center" }}>
              {drill.title}
            </Heading>
            <Button onClick={() => setView("overview")} style={{ flexShrink: 0 }}>
              Overview
            </Button>
          </Flex>
          <PracticeView drill={drill} />
        </>
      ) : (
        <>
          <Flex align="center" gap="3" wrap="wrap">
            <Button variant="soft" onClick={() => setView("practice")} style={{ flexShrink: 0 }}>
              ← Back
            </Button>
            <Heading size="6" style={{ flex: 1, textAlign: "center" }}>
              {drill.title}
            </Heading>
          </Flex>
          <DrillOverView drill={drill} />
        </>
      )}
    </div>
  )
}
