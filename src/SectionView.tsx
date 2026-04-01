import { Flex } from "@radix-ui/themes"
import * as React from "react"
import { HighlightedCard, SectionHeader } from "./components"
import { MeasureView } from "./MeasureView"
import { Pos, Section } from "./model"
import { SizeLevel, SIZE_CONFIGS } from "./sizeConfig"

export function SectionView({
  section,
  isHighlighted,
  repeatDisplay,
  highlight,
  sizeLevel = 5,
}: {
  section: Section
  isHighlighted: boolean
  repeatDisplay?: string
  highlight?: Pos
  sizeLevel?: SizeLevel
}) {
  const config = SIZE_CONFIGS[sizeLevel]
  return (
    <HighlightedCard isHighlighted={isHighlighted}>
      <Flex direction="column" style={{ padding: config.cardPadding, gap: Math.round(config.cardPadding * 0.6) }}>
        <SectionHeader
          label={section.label}
          repeatDisplay={repeatDisplay}
          labelSize={config.labelSize}
          repeatSize={config.repeatSize}
        />
        <Flex direction="row" wrap="wrap" style={{ gap: config.measureGap }} justify="center">
          {section.measures.map((measure, measureIndex) => (
            <MeasureView
              key={measureIndex}
              measure={measure}
              strokeSize={config.strokeSize}
              highlightBeat={
                isHighlighted && highlight && highlight.measure === measureIndex
                  ? highlight.offset
                  : undefined
              }
            />
          ))}
        </Flex>
      </Flex>
    </HighlightedCard>
  )
}
