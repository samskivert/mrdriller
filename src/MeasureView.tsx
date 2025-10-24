import * as React from "react"
import { Flex, Box } from "@radix-ui/themes"
import { Beat, Measure } from "./model"
import { StrokeView } from "./StrokeView"

function BeatView({
  beat,
  forceLabel,
  highlight,
}: {
  beat: Beat
  forceLabel: boolean
  highlight: boolean
}) {
  return (
    <Flex direction="column" align="center">
      {forceLabel && (
        <Box style={{ height: 20, marginBottom: 4 }} display="flex" align="center">
          {beat.label ?? ""}
        </Box>
      )}
      <Flex direction="column">
        {beat.strokes.map((stroke, strokeIndex) => (
          <StrokeView key={strokeIndex} stroke={stroke} highlight={highlight} />
        ))}
      </Flex>
    </Flex>
  )
}

export function MeasureView({
  measure,
  highlightBeat,
}: {
  measure: Measure
  highlightBeat?: number
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
          />
        ) : (
          <Box key={beatIndex} style={{ width: 36 }} />
        ),
      )}
    </Flex>
  )
}
