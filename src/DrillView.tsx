import { Button, Flex, Heading, Tabs } from "@radix-ui/themes"
import * as React from "react"
import { DrillOverView } from "./DrillOverviewView"
import { Drill } from "./model"
import { PracticeView } from "./PracticeView"

export function DrillView({ drill, onBack }: { drill: Drill; onBack: () => void }) {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Fixed Header with back button, title, and tabs all in one row */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid var(--gray-6)",
          flex: "0 0 auto", // Fixed size, don't grow or shrink
          backgroundColor: "var(--color-background)",
          height: "100%",
        }}
      >
        <Tabs.Root
          defaultValue="overview"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Flex align="center" gap="4" style={{ marginBottom: "12px" }}>
            <Button variant="soft" onClick={onBack}>
              ← Back to Drills
            </Button>
            <div style={{ flex: "1" }} /> {/* Spacer to push tabs to center */}
            <Tabs.List>
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="practice">Practice</Tabs.Trigger>
            </Tabs.List>
            <div style={{ flex: "1" }} /> {/* Spacer to push title to right */}
            <Heading size="6">{drill.title}</Heading>
          </Flex>

          {/* Scrollable Content Area */}
          <Tabs.Content value="overview">
            <DrillOverView drill={drill} />
          </Tabs.Content>

          <Tabs.Content value="practice" style={{ height: "100%" }}>
            <PracticeView drill={drill} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  )
}
