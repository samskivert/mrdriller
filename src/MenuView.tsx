import * as React from "react"
import { Drill } from "./model"

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
