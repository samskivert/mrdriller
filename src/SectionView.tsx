import { Flex, Text, Box } from "@radix-ui/themes"
import * as React from "react"
import { HighlightedCard } from "./components"
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
    <HighlightedCard isHighlighted={isHighlighted}>
      <Flex direction="column" gap="4" style={{ padding: "24px" }}>
        {(section.label || repeatDisplay) && (
          <Flex justify="between" align="center">
            <Text size="6" weight="bold">
              {section.label || ""}
            </Text>
            {repeatDisplay && (
              <Text size="6" weight="bold" color="blue">
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
                strokeSize={64}
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
    </HighlightedCard>
  )
}
