import { BackButton } from "./components"
import { Navigation } from "./model"
import { settings, setSetting } from "./settings"
import { Flex, Heading, Box, Text, Toggle } from "./ui"

function SettingRow(props: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Flex align="center" justify="between" gap="4">
      <Flex direction="column" gap="1">
        <Text as="label" weight="medium">
          {props.label}
        </Text>
        <Text size="2" color="gray">
          {props.description}
        </Text>
      </Flex>
      <Toggle size="3" checked={props.checked} onCheckedChange={props.onChange} />
    </Flex>
  )
}

export function SettingsView(props: { nav: Navigation }) {
  return (
    <Flex direction="column" gap="6" style={{ padding: "24px", "min-height": "100dvh", "background-color": "white" }}>
      <Flex align="center" justify="between" wrap="wrap" gap="3">
        <BackButton nav={props.nav} />
        <Heading size="6" style={{ flex: 1, "text-align": "center" }}>
          Settings
        </Heading>
        <Box style={{ width: "80px", "flex-shrink": 0 }} />
      </Flex>
      <Flex direction="column" gap="5" style={{ "max-width": "480px", margin: "0 auto", width: "100%" }}>
        <SettingRow
          label="Bouncing dot"
          description="Highlight the active beat while a drill plays. When off, only the active section is highlighted."
          checked={settings().showBouncingDot}
          onChange={(v) => setSetting("showBouncingDot", v)}
        />
        <SettingRow
          label="Replay intro on BPM increase"
          description={
            'When the BPM goes up mid-drill, replay the "Ichi, Ni, So, Re" intro. When off, the repeat starts straight away.'
          }
          checked={settings().replayIntroOnBpmIncrease}
          onChange={(v) => setSetting("replayIntroOnBpmIncrease", v)}
        />
      </Flex>
    </Flex>
  )
}
