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
  labelSize = "2",
  repeatSize = "2",
}: {
  label?: string
  repeatDisplay?: string
  labelSize?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  repeatSize?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
}) {
  if (!label && !repeatDisplay) return null

  return (
    <Flex justify="between" align="center">
      {label && (
        <Text size={labelSize} weight="bold">
          {label}
        </Text>
      )}
      {repeatDisplay && (
        <Text size={repeatSize} weight="bold" color="gray">
          {repeatDisplay}
        </Text>
      )}
    </Flex>
  )
}

export function EmptyBeatPlaceholder({ strokeSize = 28 }: { strokeSize?: number }) {
  return <div style={{ minWidth: strokeSize + 8 }} />
}

const IntroText = ["Ichi - いち", "Ni - に", "So - そ〜", "Re - れ！"]

export function CountdownSection({
  beat,
  beatsPerMeasure,
  intro,
  preText = "Get ready...",
}: {
  beat: number
  beatsPerMeasure: number
  intro: boolean
  preText?: string
}) {
  const measure = Math.floor(beat / beatsPerMeasure)
  const text = !intro
    ? preText
    : measure >= IntroText.length
      ? IntroText[IntroText.length - 1]
      : IntroText[measure]
  return (
    <HighlightedCard isHighlighted={intro} minHeight={100}>
      <Flex align="center" justify="center">
        <Text
          size="9"
          weight="bold"
          color={intro ? "blue" : "gray"}
          style={{ textAlign: "center" }}
        >
          {text}
        </Text>
      </Flex>
    </HighlightedCard>
  )
}
