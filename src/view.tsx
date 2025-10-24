import { Flex, Text, Card, Heading } from "@radix-ui/themes"
import * as React from "react"
import { MeasureView } from "./MeasureView"
import { Section, Row, Drill } from "./model"

export type Pos = {
  row: number
  section: number
  measure: number
  offset: number
  repeat: number
}
const Zero = { row: 0, section: 0, measure: 0, offset: 0, repeat: 0 }

function SectionView({ section, pos, highlight }: { section: Section; pos: Pos; highlight?: Pos }) {
  const isHighlighted = pos.row === highlight?.row && pos.section === highlight?.section

  // Show current repeat position if highlighted, otherwise show total repeats
  const repeatDisplay =
    isHighlighted && section.repeat > 1
      ? `${highlight.repeat + 1}/${section.repeat}`
      : section.repeat > 1
        ? `x${section.repeat}`
        : null

  return (
    <Card
      variant={isHighlighted ? "surface" : "classic"}
      style={{
        border: isHighlighted ? "2px solid var(--accent-9)" : "2px solid var(--gray-9)",
        backgroundColor: isHighlighted ? "var(--accent-2)" : "transparent",
        boxShadow: isHighlighted ? "0 0 0 2px var(--accent-6)" : "none",
      }}
    >
      <Flex direction="column" gap="2">
        {(section.label || repeatDisplay) && (
          <Flex justify="between" align="center" style={{ minHeight: 20 }}>
            <Text size="2" weight="bold">
              {section.label || ""}
            </Text>
            {repeatDisplay && (
              <Text size="2" weight="bold">
                {repeatDisplay}
              </Text>
            )}
          </Flex>
        )}
        <Flex direction="row" wrap="wrap" gap="1">
          {section.measures.map((measure, measureIndex) => (
            <MeasureView
              key={measureIndex}
              measure={measure}
              highlightBeat={
                isHighlighted && highlight.measure == measureIndex ? highlight.offset : undefined
              }
            />
          ))}
        </Flex>
      </Flex>
    </Card>
  )
}

function RowView({ row, rowIndex, highlight }: { row: Row; rowIndex: number; highlight?: Pos }) {
  return (
    <Flex direction="row" wrap="wrap" gap="2">
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

export function DrillView({ drill, highlight }: { drill: Drill; highlight?: Pos }) {
  return (
    <Flex direction="column" gap="3">
      <Heading size="6">{drill.title}</Heading>
      <Flex direction="column" gap="2">
        {drill.rows.map((row, rowIndex) => (
          <RowView key={rowIndex} row={row} rowIndex={rowIndex} highlight={highlight} />
        ))}
      </Flex>
    </Flex>
  )
}
