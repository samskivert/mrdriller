import { Card } from "@radix-ui/themes"
import * as React from "react"

export function HighlightedCard({
  children,
  isHighlighted,
  minHeight,
}: {
  children: React.ReactNode
  isHighlighted: boolean
  minHeight?: number
}) {
  return (
    <Card
      variant="surface"
      style={{
        border: isHighlighted ? "3px solid var(--accent-9)" : "2px solid var(--gray-9)",
        backgroundColor: isHighlighted ? "var(--accent-2)" : "var(--gray-2)",
        boxShadow: isHighlighted ? "0 0 0 3px var(--accent-6)" : "none",
        minHeight: minHeight || "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </Card>
  )
}
