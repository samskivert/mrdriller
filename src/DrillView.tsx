import { BackButton, SettingsButton } from "./components"
import { Drill, Navigation } from "./model"
import { PracticeView } from "./PracticeView"
import { Flex, Heading } from "./ui"

export function DrillView(props: { drill: Drill; nav: Navigation }) {
  return (
    <Flex
      direction="column"
      gap="6"
      style={{ padding: "24px", "min-height": "100dvh", "background-color": "white" }}
    >
      <Flex align="center" justify="between" wrap="wrap" gap="3">
        <BackButton nav={props.nav} />
        <Heading size="6" style={{ flex: 1, "text-align": "center" }}>
          {props.drill.title}
        </Heading>
        <SettingsButton nav={props.nav} />
      </Flex>
      <PracticeView drill={props.drill} />
    </Flex>
  )
}
