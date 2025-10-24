import { Flex, Text, Card } from "@radix-ui/themes"
import * as React from "react"
import { MeasureView } from "./MeasureView"
import { Section, Row, Drill, Pos } from "./model"

const Zero = { row: 0, section: 0, measure: 0, offset: 0, repeat: 0 }

function SectionView({ section }: { section: Section; pos: Pos; highlight?: Pos }) {
  return (
    <Card>
      <Flex direction="column" gap="2">
        {section.label && (
          <Flex justify="between" align="center" style={{ minHeight: 20 }}>
            <Text size="2" weight="bold">
              {section.label || ""}
            </Text>
          </Flex>
        )}
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
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Flex direction="column" gap="2" style={{ width: "fit-content" }}>
        {drill.rows.map((row, rowIndex) => (
          <RowView key={rowIndex} row={row} rowIndex={rowIndex} />
        ))}
      </Flex>
    </div>
  )
}
