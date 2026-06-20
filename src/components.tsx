import { JSX, Show } from "solid-js"
import { Flex, Text } from "./ui"

export function HighlightedCard(props: {
  children: JSX.Element
  isHighlighted: boolean
  minHeight?: number
}) {
  return (
    <div
      style={{
        border: props.isHighlighted ? "3px solid #0090ff" : "2px solid #999",
        "background-color": props.isHighlighted ? "#fff3c4" : "#f9f9fb",
        "box-shadow": props.isHighlighted ? "0 0 0 3px #70b8ff" : "none",
        "min-height": props.minHeight ? `${props.minHeight}px` : "auto",
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        "border-radius": "8px",
        padding: "12px",
        "box-sizing": "border-box",
        width: "100%",
      }}
    >
      {props.children}
    </div>
  )
}

export function CenteredContainer(props: {
  children: JSX.Element
  maxWidth?: string
}) {
  return (
    <div style={{ display: "flex", "justify-content": "center", width: "100%" }}>
      <Flex direction="column" gap="4" style={{ width: "fit-content", "max-width": props.maxWidth }}>
        {props.children}
      </Flex>
    </div>
  )
}

export function NumberInput(props: {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  width?: number
}) {
  return (
    <Flex align="center" gap="2">
      <Text size="2" weight="medium">{props.label}:</Text>
      <input
        type="number"
        value={props.value}
        onInput={(e) => props.onChange(parseInt(e.currentTarget.value) || props.min)}
        min={props.min}
        max={props.max}
        style={{ width: `${props.width ?? 60}px` }}
      />
    </Flex>
  )
}

export function SectionHeader(props: {
  label?: string
  repeatDisplay?: string
  labelSize?: string
  repeatSize?: string
}) {
  return (
    <Show when={props.label || props.repeatDisplay}>
      <Flex justify="between" align="center">
        <Show when={props.label}>
          <Text size={props.labelSize ?? "2"} weight="bold">{props.label}</Text>
        </Show>
        <Show when={props.repeatDisplay}>
          <Text size={props.repeatSize ?? props.labelSize ?? "2"} weight="bold" color="gray">
            {props.repeatDisplay}
          </Text>
        </Show>
      </Flex>
    </Show>
  )
}

export function EmptyBeatPlaceholder(props: { strokeSize?: number }) {
  return <div style={{ "min-width": `${(props.strokeSize ?? 28) + 8}px` }} />
}

const IntroText = ["Ichi - いち", "Ni - に", "So - そ〜", "Re - れ！"]

export function CountdownSection(props: {
  beat: number
  beatsPerMeasure: number
  intro: boolean
  preText?: string
}) {
  const measure = () => Math.floor(props.beat / props.beatsPerMeasure)
  const text = () =>
    !props.intro
      ? (props.preText ?? "Get ready...")
      : measure() >= IntroText.length
        ? IntroText[IntroText.length - 1]
        : IntroText[measure()]

  return (
    <HighlightedCard isHighlighted={props.intro} minHeight={100}>
      <Flex align="center" justify="center">
        <Text
          size="9"
          weight="bold"
          color={props.intro ? "blue" : "gray"}
          style={{ "text-align": "center" }}
        >
          {text()}
        </Text>
      </Flex>
    </HighlightedCard>
  )
}
