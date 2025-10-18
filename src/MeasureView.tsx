import * as React from "react"
import { Measure } from "./model"
import { StrokeView } from "./StrokeView"

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
      {measure.map((beat, beatIndex) => {
        if (!beat) {
          return <div key={beatIndex} style={{ width: 36 }} />
        }

        const isBeatHighlighted = beatIndex === highlightBeat

        return (
          <div
            key={beatIndex}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {hasAnyLabels && (
              <div
                style={{
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                {beat.label && <div>{beat.label}</div>}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {beat.strokes.map((stroke, strokeIndex) => (
                <StrokeView
                  key={strokeIndex}
                  stroke={stroke}
                  highlight={isBeatHighlighted}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
