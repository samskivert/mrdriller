import { Card, Flex, Text, TextField } from "@radix-ui/themes"
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
        backgroundColor: isHighlighted ? "#FFD700" : "var(--gray-2)",
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

export function CenteredContainer({
  children,
  maxWidth,
}: {
  children: React.ReactNode
  maxWidth?: string
}) {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Flex direction="column" gap="4" style={{ width: "fit-content", maxWidth }}>
        {children}
      </Flex>
    </div>
  )
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  width = 60,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  width?: number
}) {
  return (
    <Flex align="center" gap="2">
      <Text size="2" weight="medium">
        {label}:
      </Text>
      <TextField.Root
        type="number"
        value={value.toString()}
        onChange={(e) => onChange(parseInt(e.target.value) || min)}
        min={min.toString()}
        max={max.toString()}
        style={{ width }}
        size="2"
      />
    </Flex>
  )
}

export function SectionHeader({
  label,
  repeatDisplay,
}: {
  label?: string
  repeatDisplay?: string
}) {
  if (!label && !repeatDisplay) return null

  return (
    <Flex justify="between" align="center">
      {label && (
        <Text size="6" weight="bold">
          {label}
        </Text>
      )}
      {repeatDisplay && (
        <Text size="6" weight="bold" color="blue">
          {repeatDisplay}
        </Text>
      )}
    </Flex>
  )
}

export function EmptyBeatPlaceholder({ strokeSize = 28 }: { strokeSize?: number }) {
  return <div style={{ minWidth: strokeSize + 8 }} />
}
