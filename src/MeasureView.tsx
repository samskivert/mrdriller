import { For, Show } from "solid-js"
import { EmptyBeatPlaceholder } from "./components"
import { Beat, Measure } from "./model"
import { StrokeView } from "./StrokeView"
import { Flex, Box } from "./ui"

function BeatView(props: {
  beat: Beat
  forceLabel: boolean
  highlight: boolean
  strokeSize?: number
}) {
  const strokeSize = () => props.strokeSize ?? 28
  return (
    <Flex direction="column" align="center">
      <Show when={props.forceLabel}>
        <Box
          style={{
            height: `${Math.round(strokeSize() * 0.7)}px`,
            "margin-bottom": `${Math.round(strokeSize() * 0.14)}px`,
            "font-size": `${Math.max(10, Math.round(strokeSize() * 0.45))}px`,
            display: "flex",
            "align-items": "center",
          }}
        >
          {props.beat.label ?? ""}
        </Box>
      </Show>
      <Flex direction="column">
        <For each={props.beat.strokes}>
          {(stroke) => (
            <StrokeView stroke={stroke} highlight={props.highlight} size={strokeSize()} />
          )}
        </For>
      </Flex>
    </Flex>
  )
}

export function MeasureView(props: {
  measure: Measure
  highlightBeat?: number
  strokeSize?: number
}) {
  const hasAnyLabels = () => props.measure.some((b) => b?.label)
  return (
    <Flex direction="row">
      <For each={props.measure}>
        {(beatItem, i) => (
          <Show when={beatItem} fallback={<EmptyBeatPlaceholder strokeSize={props.strokeSize} />}>
            {(b) => (
              <BeatView
                beat={b()}
                forceLabel={hasAnyLabels()}
                highlight={i() === props.highlightBeat}
                strokeSize={props.strokeSize}
              />
            )}
          </Show>
        )}
      </For>
    </Flex>
  )
}
