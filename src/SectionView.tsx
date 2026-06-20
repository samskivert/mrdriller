import { For } from "solid-js"
import { Flex } from "./ui"
import { HighlightedCard, SectionHeader } from "./components"
import { MeasureView } from "./MeasureView"
import { Pos, Section } from "./model"
import { SizeLevel, SIZE_CONFIGS } from "./sizeConfig"

export function SectionView(props: {
  section: Section
  isHighlighted: boolean
  repeatDisplay?: string
  highlight?: Pos
  sizeLevel?: SizeLevel
}) {
  const config = () => SIZE_CONFIGS[props.sizeLevel ?? 5]
  return (
    <HighlightedCard isHighlighted={props.isHighlighted}>
      <Flex
        direction="column"
        style={{
          padding: `${config().cardPadding}px`,
          gap: `${Math.round(config().cardPadding * 0.6)}px`,
          width: "100%",
        }}
      >
        <SectionHeader
          label={props.section.label}
          repeatDisplay={props.repeatDisplay}
          labelSize={config().labelSize}
          repeatSize={config().repeatSize}
        />
        <Flex direction="row" wrap="wrap" justify="center" style={{ gap: `${config().measureGap}px` }}>
          <For each={props.section.measures}>
            {(measure, i) => (
              <MeasureView
                measure={measure}
                strokeSize={config().strokeSize}
                highlightBeat={
                  props.isHighlighted && props.highlight && props.highlight.measure === i()
                    ? props.highlight.offset
                    : undefined
                }
              />
            )}
          </For>
        </Flex>
      </Flex>
    </HighlightedCard>
  )
}
