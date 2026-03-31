import { Button, Flex, Heading } from "@radix-ui/themes"
import * as React from "react"
import { Drill } from "./model"
import { PracticeView } from "./PracticeView"

export function DrillView({ drill, onBack }: { drill: Drill; onBack: () => void }) {
  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <Flex align="center" justify="between" wrap="wrap" gap="3">
        <Button variant="soft" onClick={onBack} style={{ flexShrink: 0 }}>
          ← Back
        </Button>
        <Heading size="6" style={{ flex: 1, textAlign: "center" }}>
          {drill.title}
        </Heading>
        <div style={{ width: 80, flexShrink: 0 }} />
      </Flex>
      <PracticeView drill={drill} />
    </div>
  )
}
