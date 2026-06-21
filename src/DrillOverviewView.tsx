import { For } from "solid-js"
import { Flex, Card } from "./ui"
import { SectionHeader } from "./components"
import { MeasureView } from "./MeasureView"
import { Section, Row, Drill } from "./model"

function OverviewSectionView(props: { section: Section }) {
  return (
    <Card>
      <Flex direction="column" gap="2">
        <SectionHeader
          label={props.section.label}
          repeatDisplay={props.section.repeat > 1 ? `x${props.section.repeat}` : undefined}
        />
        <Flex direction="column" gap="2">
          <For each={props.section.lines}>
            {(line) => <Flex direction="row" wrap="wrap" gap="1" justify="center">
              <For each={line.measures}>
                {(measure) => <MeasureView measure={measure} />}
              </For>
            </Flex>}
          </For>
        </Flex>
      </Flex>
    </Card>
  )
}

function RowView(props: { row: Row }) {
  return (
    <Flex direction="row" wrap="wrap" gap="2" justify="center">
      <For each={props.row}>
        {(section) => <OverviewSectionView section={section} />}
      </For>
    </Flex>
  )
}

export function DrillOverView(props: { drill: Drill }) {
  return (
    <Flex direction="column" gap="4" align="center" style={{ "max-width": "1200px" }}>
      <For each={props.drill.rows}>
        {(row) => <RowView row={row} />}
      </For>
    </Flex>
  )
}
