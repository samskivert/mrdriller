import * as React from "react"
import { Beat, Measure } from "./model"
import { StrokeView } from "./StrokeView"

const beatStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}

const beatLabelStyle: React.CSSProperties = {
  height: 20,
  display: "flex",
  alignItems: "center",
  marginBottom: 4,
}

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
    <div style={beatStyle}>
      {forceLabel && <div style={beatLabelStyle}>{beat.label ?? ""}</div>}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {beat.strokes.map((stroke, strokeIndex) => (
          <StrokeView key={strokeIndex} stroke={stroke} highlight={highlight} />
        ))}
      </div>
    </div>
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
    <div style={{ display: "flex", flexDirection: "row" }}>
      {measure.map((beat, beatIndex) =>
        beat ? (
          <BeatView
            key={beatIndex}
            beat={beat}
            forceLabel={hasAnyLabels}
            highlight={beatIndex === highlightBeat}
          />
        ) : (
          <div key={beatIndex} style={{ width: 36 }} />
        ),
      )}
    </div>
  )
}
