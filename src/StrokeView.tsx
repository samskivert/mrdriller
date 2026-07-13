import { Show, Switch, Match } from "solid-js"
import { Stroke } from "./model"

export function StrokeView(props: { stroke: Stroke | undefined; highlight?: boolean; size?: number }) {
  const size = () => props.size ?? 28
  const containerStyle = () => ({
    width: `${size()}px`,
    height: `${size()}px`,
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
    margin: "4px",
    position: "relative" as const,
  })

  // Returns the stroke only when it's a directional (up/down) stroke, undefined otherwise.
  const directionalStroke = () => {
    const s = props.stroke
    return s && (s.dir === "D" || s.dir === "U") ? s : undefined
  }

  const labelStyle = (color: () => string) => ({
    position: "relative" as const,
    "z-index": 1,
    color: props.highlight ? "white" : color(),
    "font-weight": 600,
    "font-size": `${Math.max(10, size() * 0.4)}px`,
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
    width: "100%",
    height: "100%",
  })

  return (
    <Switch>
      <Match when={!props.stroke}>
        <div style={containerStyle()} />
      </Match>

      <Match when={directionalStroke()}>
        {(s) => {
          const color = () => (s().hand === "R" ? "#0072B7" : "#FF9A00")
          const pad = 2
          const svgSize = () => size() + pad * 2
          const half = () => size() / 2
          const path = () =>
            s().dir === "D"
              ? `M ${pad} ${half() + pad} A ${half()} ${half()} 0 0 1 ${size() + pad} ${half() + pad} L ${half() + pad} ${size() + pad} Z`
              : `M ${pad} ${half() + pad} L ${half() + pad} ${pad} L ${size() + pad} ${half() + pad} A ${half()} ${half()} 0 0 1 ${pad} ${half() + pad} Z`
          return (
            <div style={containerStyle()}>
              <svg
                width={svgSize()}
                height={svgSize()}
                style={{
                  position: "absolute",
                  left: `-${pad}px`,
                  top: `-${pad}px`,
                  "pointer-events": "none",
                }}
              >
                <path
                  d={path()}
                  fill={props.highlight ? color() : "transparent"}
                  stroke={color()}
                  stroke-width={s().accent ? 4 : 2}
                />
              </svg>
              <div style={labelStyle(color)}>{s().hand}</div>
            </div>
          )
        }}
      </Match>

      <Match when={props.stroke}>
        {(s) => {
          const color = () => (s().hand === "R" ? "#0072B7" : "#FF9A00")
          const pad = 2
          const svgSize = () => size() + pad * 2
          const center = () => size() / 2 + pad
          const radius = () => size() / 2 - 1
          return (
            <div style={containerStyle()}>
              <svg
                width={svgSize()}
                height={svgSize()}
                style={{
                  position: "absolute",
                  left: `-${pad}px`,
                  top: `-${pad}px`,
                  "pointer-events": "none",
                }}
              >
                <circle
                  cx={center()}
                  cy={center()}
                  r={radius() - size() / 8 - 1}
                  fill={props.highlight ? color() : "transparent"}
                  stroke={color()}
                  stroke-width={2}
                />
                <Show when={s().accent}>
                  <circle
                    cx={center()}
                    cy={center()}
                    r={radius()}
                    fill={props.highlight ? color() : "transparent"}
                    stroke={color()}
                    stroke-width={2}
                  />
                </Show>
              </svg>
              <div style={labelStyle(color)}>{s().hand}</div>
            </div>
          )
        }}
      </Match>
    </Switch>
  )
}
