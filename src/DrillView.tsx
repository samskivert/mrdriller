import { Flex, Heading, Button, Box } from "./ui"
import { Drill } from "./model"
import { PracticeView } from "./PracticeView"

export function DrillView(props: { drill: Drill; onBack: () => void }) {
  return (
    <Flex
      direction="column"
      gap="6"
      style={{ padding: "24px", "min-height": "100dvh", "background-color": "white" }}
    >
      <Flex align="center" justify="between" wrap="wrap" gap="3">
        <Button variant="soft" onClick={props.onBack} style={{ "flex-shrink": 0 }}>
          ← Back
        </Button>
        <Heading size="6" style={{ flex: 1, "text-align": "center" }}>
          {props.drill.title}
        </Heading>
        <Box style={{ width: "80px", "flex-shrink": 0 }} />
      </Flex>
      <PracticeView drill={props.drill} />
    </Flex>
  )
}
