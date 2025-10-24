import { Flex, Card } from "@radix-ui/themes"
import * as React from "react"
import { CenteredContainer, SectionHeader } from "./components"
import { MeasureView } from "./MeasureView"
import { Section, Row, Drill, Pos } from "./model"

const Zero = { row: 0, section: 0, measure: 0, offset: 0, repeat: 0 }

function SectionView({ section }: { section: Section; pos: Pos; highlight?: Pos }) {
  return (
    <Card>
      <Flex direction="column" gap="2">
        <SectionHeader
          label={section.label}
          repeatDisplay={section.repeat > 1 ? `x${section.repeat}` : undefined}
          size="2"
        />
        <Flex direction="row" wrap="wrap" gap="1" justify="start">
          {section.measures.map((measure, measureIndex) => (
            <MeasureView key={measureIndex} measure={measure} />
          ))}
        </Flex>
      </Flex>
    </Card>
  )
}

function RowView({ row, rowIndex, highlight }: { row: Row; rowIndex: number; highlight?: Pos }) {
  return (
    <Flex direction="row" wrap="wrap" gap="2" justify="center">
      {row.map((section, sectionIndex) => (
        <SectionView
          key={sectionIndex}
          section={section}
          pos={{ ...Zero, row: rowIndex, section: sectionIndex }}
          highlight={highlight}
        />
      ))}
    </Flex>
  )
}

export function DrillOverView({ drill }: { drill: Drill }) {
  return (
    <CenteredContainer>
      {drill.rows.map((row, rowIndex) => (
        <RowView key={rowIndex} row={row} rowIndex={rowIndex} />
      ))}
    </CenteredContainer>
  )
}
