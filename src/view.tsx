import * as React from "react"
import { Stroke, Beat, Measure, Section, Drill } from "./model"

export function strokeView(stroke: Stroke) {
  const color = stroke.hand === "R" ? "#0072B8" : "#FF9A00"
  const isAccented = stroke.accent
  const size = 28 // isAccented ? 32 : 28

  // Determine shape based on direction
  const isDownStroke = stroke.dir === "D"
  const isUpStroke = stroke.dir === "U"
  const isDirectional = isDownStroke || isUpStroke

  const containerStyle = {
    width: size,
    height: size,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    position: "relative" as const,
  }

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
            fill="transparent"
            stroke={color}
            strokeWidth={isAccented ? 4 : 2}
          />
        </svg>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            color: color,
            fontWeight: 600,
            fontSize: "12px",
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
            cx={size / 2 + strokePadding}
            cy={size / 2 + strokePadding}
            r={size / 2 - 1}
            fill="transparent"
            stroke={color}
            strokeWidth={isAccented ? 4 : 2}
          />
        </svg>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            color: color,
            fontWeight: 600,
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

export function beatView(beat: Beat) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {beat.label && <div>{beat.label}</div>}
      {beat.strokes.map(strokeView)}
    </div>
  )
}

export function measureView(measure: Measure) {
  const hasAnyLabels = measure.some((beat) => beat?.label)

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {measure.map((beat, index) => {
        if (!beat) {
          return <div key={index} style={{ width: 36 }} />
        }

        return (
          <div
            key={index}
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
              {beat.strokes.map(strokeView)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function sectionView(section: Section) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "2px solid #333333",
        padding: 8,
      }}
    >
      {section.label && (
        <div style={{ textAlign: "center", fontWeight: 600, marginBottom: 8 }}>
          {section.label}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "row" }}>
        {section.measures.map(measureView)}
      </div>
    </div>
  )
}

export function drillView(drill: Drill) {
  return (
    <>
      <h1>{drill.title}</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {drill.sections.map(sectionView)}
      </div>
    </>
  )
}

export function PracticeView({
  drill,
  onBack,
}: {
  drill: Drill
  onBack: () => void
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button
        onClick={onBack}
        style={{
          padding: "8px 16px",
          fontSize: 16,
          cursor: "pointer",
          border: "1px solid #ccc",
          borderRadius: 4,
          backgroundColor: "#f5f5f5",
        }}
      >
        ← Back to Menu
      </button>
      {drillView(drill)}
    </div>
  )
}

export function MenuView({
  drills,
  onSelectDrill,
}: {
  drills: Drill[]
  onSelectDrill: (drill: Drill) => void
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
      }}
    >
      <h1>Mr. Driller</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {drills.map((drill, index) => (
          <button
            key={index}
            onClick={() => onSelectDrill(drill)}
            style={{
              padding: "12px 24px",
              fontSize: 16,
              cursor: "pointer",
              border: "1px solid #ccc",
              borderRadius: 4,
              backgroundColor: "#f9f9f9",
              minWidth: 200,
            }}
          >
            {drill.title}
          </button>
        ))}
      </div>
    </div>
  )
}
