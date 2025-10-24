import { Card, Flex, Text, Box } from "@radix-ui/themes"
import * as React from "react"
import { MeasureView } from "./MeasureView"
import { Pos, Section } from "./model"

export function SectionView({
  section,
  isHighlighted,
  repeatDisplay,
  highlight,
}: {
  section: Section
  isHighlighted: boolean
  repeatDisplay?: string
  highlight?: Pos
}) {
  return (
    <Card
      variant={isHighlighted ? "surface" : "classic"}
      style={{
        border: isHighlighted ? "3px solid var(--accent-9)" : "2px solid var(--gray-9)",
        backgroundColor: isHighlighted ? "var(--accent-2)" : "var(--gray-2)",
        boxShadow: isHighlighted ? "0 0 0 3px var(--accent-6)" : "none",
        minHeight: "200px",
        padding: "24px",
      }}
    >
      <Flex direction="column" gap="4">
        {(section.label || repeatDisplay) && (
          <Flex justify="between" align="center">
            <Text size="4" weight="bold">
              {section.label || ""}
            </Text>
            {repeatDisplay && (
              <Text size="3" weight="bold" color="blue">
                {repeatDisplay}
              </Text>
            )}
          </Flex>
        )}
        <Flex direction="row" wrap="wrap" gap="4" justify="center">
          {section.measures.map((measure, measureIndex) => (
            <Box key={measureIndex} style={{ minWidth: "200px" }}>
              <MeasureView
                measure={measure}
                strokeSize={42}
                highlightBeat={
                  isHighlighted && highlight && highlight.measure === measureIndex
                    ? highlight.offset
                    : undefined
                }
              />
            </Box>
          ))}
        </Flex>
      </Flex>
    </Card>
  )
}
