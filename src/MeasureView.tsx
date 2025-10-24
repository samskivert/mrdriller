import { Flex, Box } from "@radix-ui/themes"
import * as React from "react"
import { EmptyBeatPlaceholder } from "./components"
import { Beat, Measure } from "./model"
import { StrokeView } from "./StrokeView"

function BeatView({
  beat,
  forceLabel,
  highlight,
  strokeSize = 28,
}: {
  beat: Beat
  forceLabel: boolean
  highlight: boolean
  strokeSize?: number
}) {
  return (
    <Flex direction="column" align="center">
      {forceLabel && (
        <Box style={{ height: 20, marginBottom: 4, display: "flex", alignItems: "center" }}>
          {beat.label ?? ""}
        </Box>
      )}
      <Flex direction="column">
        {beat.strokes.map((stroke, strokeIndex) => (
          <StrokeView key={strokeIndex} stroke={stroke} highlight={highlight} size={strokeSize} />
        ))}
      </Flex>
    </Flex>
  )
}

export function MeasureView({
  measure,
  highlightBeat,
  strokeSize = 28,
}: {
  measure: Measure
  highlightBeat?: number
  strokeSize?: number
}) {
  const hasAnyLabels = measure.some((beat) => beat?.label)
  return (
    <Flex direction="row">
      {measure.map((beat, beatIndex) =>
        beat ? (
          <BeatView
            key={beatIndex}
            beat={beat}
            forceLabel={hasAnyLabels}
            highlight={beatIndex === highlightBeat}
            strokeSize={strokeSize}
          />
        ) : (
          <EmptyBeatPlaceholder key={beatIndex} strokeSize={strokeSize} />
        ),
      )}
    </Flex>
  )
}
