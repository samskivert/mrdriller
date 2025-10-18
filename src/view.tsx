import * as React from "react"
import { Section, Row, Drill } from "./model"
import { MeasureView } from "./MeasureView"

export type Pos = {
  row: number
  section: number
  measure: number
  offset: number
  repeat: number
}
const Zero = { row: 0, section: 0, measure: 0, offset: 0, repeat: 0 }

function SectionView({
  section,
  pos,
  highlight,
}: {
  section: Section
  pos: Pos
  highlight?: Pos
}) {
  const isHighlighted =
    pos.row === highlight?.row && pos.section === highlight?.section

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
        {section.measures.map((measure, measureIndex) => (
          <MeasureView
            key={measureIndex}
            measure={measure}
            highlightBeat={
              isHighlighted && highlight.measure == measureIndex
                ? highlight.offset
                : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}

function RowView({
  row,
  rowIndex,
  highlight,
}: {
  row: Row
  rowIndex: number
  highlight?: Pos
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {row.map((section, sectionIndex) => (
        <SectionView
          key={sectionIndex}
          section={section}
          pos={{ ...Zero, row: rowIndex, section: sectionIndex }}
          highlight={highlight}
        />
      ))}
    </div>
  )
}

export function DrillView({
  drill,
  highlight,
}: {
  drill: Drill
  highlight?: Pos
}) {
  return (
    <>
      <h1>{drill.title}</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {drill.rows.map((row, rowIndex) => (
          <RowView
            key={rowIndex}
            row={row}
            rowIndex={rowIndex}
            highlight={highlight}
          />
        ))}
      </div>
    </>
  )
}
