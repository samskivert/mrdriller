import * as React from "react"
import { Stroke } from "./model"

export function StrokeView({
  stroke,
  highlight = false,
  size = 28,
}: {
  stroke: Stroke | undefined
  highlight?: boolean
  size?: number
}) {
  const containerStyle = {
    width: size,
    height: size,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    position: "relative" as const,
  }

  // Return empty space for undefined strokes
  if (!stroke) {
    return <div style={containerStyle} />
  }

  const color = stroke.hand === "R" ? "#0072B7" : "#FF9A00"
  const isAccented = stroke.accent
  const fontSize = `${Math.max(10, size * 0.4)}px`

  // Determine shape based on direction
  const isDownStroke = stroke.dir === "D"
  const isUpStroke = stroke.dir === "U"
  const isDirectional = isDownStroke || isUpStroke

  if (isDirectional) {
    // SVG half-circle + triangle
    const halfSize = size / 2
    const strokePadding = 2 // Extra space for stroke width
    const svgSize = size + strokePadding * 2
    let pathData = ""

    if (isDownStroke) {
      // Half circle on top, triangle pointing down
      pathData = `M ${strokePadding} ${halfSize + strokePadding} A ${halfSize} ${halfSize} 0 0 1 ${size + strokePadding} ${halfSize + strokePadding} L ${halfSize + strokePadding} ${size + strokePadding} Z`
    } else {
      // Half circle on bottom, triangle pointing up
      pathData = `M ${strokePadding} ${halfSize + strokePadding} L ${halfSize + strokePadding} ${strokePadding} L ${size + strokePadding} ${halfSize + strokePadding} A ${halfSize} ${halfSize} 0 0 1 ${strokePadding} ${halfSize + strokePadding} Z`
    }

    return (
      <div style={containerStyle}>
        <svg
          width={svgSize}
          height={svgSize}
          style={{
            position: "absolute",
            left: -strokePadding,
            top: -strokePadding,
            pointerEvents: "none",
          }}
        >
          <path
            d={pathData}
            fill={highlight ? color : "transparent"}
            stroke={color}
            strokeWidth={isAccented ? 4 : 2}
          />
        </svg>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            color: highlight ? "white" : color,
            fontWeight: 600,
            fontSize: fontSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {stroke.hand}
        </div>
      </div>
    )
  } else {
    // Circle shape (no direction)
    const strokePadding = 2 // Extra space for stroke width
    const svgSize = size + strokePadding * 2
    const center = size / 2 + strokePadding
    const radius = size / 2 - 1

    const accentCircle = isAccented ? (
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill={highlight ? color : "transparent"}
        stroke={color}
        strokeWidth={2}
      />
    ) : undefined

    return (
      <div style={containerStyle}>
        <svg
          width={svgSize}
          height={svgSize}
          style={{
            position: "absolute",
            left: -strokePadding,
            top: -strokePadding,
            pointerEvents: "none",
          }}
        >
          <circle
            cx={center}
            cy={center}
            r={radius - size / 8 - 1}
            fill={highlight ? color : "transparent"}
            stroke={color}
            strokeWidth={2}
          />
          {accentCircle}
        </svg>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            color: highlight ? "white" : color,
            fontWeight: 600,
            fontSize: fontSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {stroke.hand}
        </div>
      </div>
    )
  }
}
