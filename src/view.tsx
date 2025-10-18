import * as React from "react"
import { Stroke, Measure, Section, Row, Drill } from "./model"

export function strokeView(stroke: Stroke, isHighlighted: boolean = false) {
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
            fill={isHighlighted ? color : "transparent"}
            stroke={color}
            strokeWidth={isAccented ? 4 : 2}
          />
        </svg>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            color: isHighlighted ? "white" : color,
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
            fill={isHighlighted ? color : "transparent"}
            stroke={color}
            strokeWidth={isAccented ? 4 : 2}
          />
        </svg>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            color: isHighlighted ? "white" : color,
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

type Highlight = {
  row: number
  section: number
  measure: number
  offset: number
  repeat: number
}

export function measureView(
  measure: Measure,
  rowIndex: number,
  sectionIndex: number,
  measureIndex: number,
  highlight?: Highlight,
) {
  const hasAnyLabels = measure.some((beat) => beat?.label)

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {measure.map((beat, beatIndex) => {
        if (!beat) {
          return <div key={beatIndex} style={{ width: 36 }} />
        }

        const isBeatHighlighted =
          highlight?.row === rowIndex &&
          highlight?.section === sectionIndex &&
          highlight?.measure === measureIndex &&
          highlight?.offset === beatIndex

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
              {beat.strokes.map((stroke) =>
                strokeView(stroke, isBeatHighlighted),
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function sectionView(
  section: Section,
  rowIndex: number,
  sectionIndex: number,
  highlight?: Highlight,
) {
  const isHighlighted =
    highlight?.row === rowIndex && highlight?.section === sectionIndex

  // Show current repeat position if highlighted, otherwise show total repeats
  const repeatDisplay =
    isHighlighted && section.repeat > 1
      ? `${highlight.repeat + 1}/${section.repeat}`
      : section.repeat > 1
        ? `x${section.repeat}`
        : null

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "2px solid #333333",
        padding: 8,
        backgroundColor: isHighlighted ? "#f0f8ff" : "transparent",
        boxShadow: isHighlighted ? "0 0 0 2px #4ecdc4" : "none",
        boxSizing: "border-box",
      }}
    >
      {(section.label || repeatDisplay) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 600,
            marginBottom: 8,
            minHeight: 20,
          }}
        >
          <div>{section.label || ""}</div>
          {repeatDisplay && <div>{repeatDisplay}</div>}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {section.measures.map((measure, measureIndex) =>
          measureView(measure, rowIndex, sectionIndex, measureIndex, highlight),
        )}
      </div>
    </div>
  )
}

export function rowView(row: Row, rowIndex: number, highlight?: Highlight) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {row.map((section, sectionIndex) =>
        sectionView(section, rowIndex, sectionIndex, highlight),
      )}
    </div>
  )
}

export function drillView(drill: Drill, highlight?: Highlight) {
  return (
    <>
      <h1>{drill.title}</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {drill.rows.map((row, rowIndex) => rowView(row, rowIndex, highlight))}
      </div>
    </>
  )
}
