import { JSX } from "solid-js"

// Radix UI size scale → pixel values
const GAP: Record<string, string> = {
  "1": "4px", "2": "8px", "3": "12px", "4": "16px",
  "5": "20px", "6": "24px", "7": "28px", "8": "32px", "9": "40px",
}
export const FONT_SIZE: Record<string, string> = {
  "1": "12px", "2": "14px", "3": "16px", "4": "18px", "5": "20px",
  "6": "24px", "7": "28px", "8": "35px", "9": "60px",
}
const WEIGHT: Record<string, string> = { bold: "700", medium: "500", regular: "400" }
const TEXT_COLOR: Record<string, string> = {
  blue: "#0072B7", green: "#22c55e", red: "#ef4444", gray: "#6b7280",
}
const BTN_BG: Record<string, string> = {
  blue: "#3E63DD", green: "#30a46c", red: "#ef4444", gray: "#6b7280",
}
const BTN_PADDING: Record<string, string> = {
  "1": "0 8px", "2": "0 12px", "3": "0 16px", "4": "0 24px",
}
const BTN_SOFT_BG: Record<string, string> = {
  blue: "rgba(62, 99, 221, 0.067)", green: "rgba(48, 164, 108, 0.1)",
  red: "rgba(239, 68, 68, 0.1)", gray: "rgba(107, 114, 128, 0.1)",
}
const BTN_HEIGHT: Record<string, string> = {
  "1": "24px", "2": "32px", "3": "40px", "4": "48px",
}
const BTN_FONT: Record<string, string> = {
  "1": "12px", "2": "14px", "3": "16px", "4": "18px",
}

function flexAlign(v: string | undefined): string | undefined {
  return v ? ({ center: "center", start: "flex-start", end: "flex-end", stretch: "stretch", baseline: "baseline" } as Record<string, string>)[v] : undefined
}
function flexJustify(v: string | undefined): string | undefined {
  return v ? ({ center: "center", start: "flex-start", end: "flex-end", between: "space-between", around: "space-around" } as Record<string, string>)[v] : undefined
}

export function Flex(props: {
  direction?: "row" | "column"
  align?: "center" | "start" | "end" | "stretch" | "baseline"
  justify?: "center" | "start" | "end" | "between" | "around"
  wrap?: "wrap" | "nowrap"
  gap?: string
  style?: JSX.CSSProperties
  children: JSX.Element
}) {
  return (
    <div
      style={{
        display: "flex",
        "flex-direction": props.direction ?? "row",
        "align-items": flexAlign(props.align),
        "justify-content": flexJustify(props.justify),
        "flex-wrap": props.wrap,
        gap: props.gap ? GAP[props.gap] ?? props.gap : undefined,
        ...props.style,
      }}
    >
      {props.children}
    </div>
  )
}

export function Box(props: { style?: JSX.CSSProperties; children?: JSX.Element }) {
  return <div style={props.style}>{props.children}</div>
}

export function Card(props: { children: JSX.Element; style?: JSX.CSSProperties }) {
  return (
    <div
      style={{
        "border-radius": "8px",
        padding: "12px",
        "background-color": "rgba(255, 255, 255, 0.7)",
        "box-shadow": "0 0 0 1px rgba(155, 161, 182, 0.341)",
        ...props.style,
      }}
    >
      {props.children}
    </div>
  )
}

export function Grid(props: {
  columns?: string | { initial?: string; sm?: string }
  gap?: string
  children: JSX.Element
}) {
  const gridCols = () => {
    if (!props.columns) return "1fr"
    if (typeof props.columns === "string") {
      const n = parseInt(props.columns)
      return isNaN(n) ? "1fr" : `repeat(${n}, 1fr)`
    }
    return "repeat(auto-fit, minmax(150px, 1fr))"
  }
  return (
    <div
      style={{
        display: "grid",
        "grid-template-columns": gridCols(),
        gap: props.gap ? GAP[props.gap] ?? props.gap : undefined,
      }}
    >
      {props.children}
    </div>
  )
}

export function Heading(props: {
  size?: string
  align?: "center" | "left" | "right"
  style?: JSX.CSSProperties
  children: JSX.Element
}): JSX.Element {
  const s = (): JSX.CSSProperties => ({
    "font-size": props.size ? FONT_SIZE[props.size] : undefined,
    "text-align": props.align,
    margin: 0,
    ...props.style,
  })
  if (parseInt(props.size ?? "0") >= 8) return <h1 style={s()}>{props.children}</h1>
  return <h2 style={s()}>{props.children}</h2>
}

export function Text(props: {
  size?: string
  weight?: "bold" | "medium" | "regular"
  color?: string
  as?: "span" | "p" | "div" | "label"
  style?: JSX.CSSProperties
  children: JSX.Element
}): JSX.Element {
  const s = (): JSX.CSSProperties => ({
    "font-size": props.size ? FONT_SIZE[props.size] : undefined,
    "font-weight": props.weight ? WEIGHT[props.weight] : undefined,
    color: props.color ? TEXT_COLOR[props.color] : undefined,
    ...props.style,
  })
  if (props.as === "label") return <label style={s()}>{props.children}</label>
  if (props.as === "p") return <p style={s()}>{props.children}</p>
  if (props.as === "div") return <div style={s()}>{props.children}</div>
  return <span style={s()}>{props.children}</span>
}

export function Button(props: {
  variant?: "soft" | "solid" | "ghost" | "outline" | "surface"
  color?: string
  size?: string
  onClick?: () => void
  disabled?: boolean
  style?: JSX.CSSProperties
  children: JSX.Element
}) {
  const isSoft = () => props.variant === "soft" || props.variant === "ghost" || props.variant === "outline" || props.variant === "surface"
  const col = () => props.color ?? "blue"
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      style={{
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "center",
        height: BTN_HEIGHT[props.size ?? "2"] ?? BTN_HEIGHT["2"],
        padding: BTN_PADDING[props.size ?? "2"] ?? BTN_PADDING["2"],
        "border-radius": "8px",
        border: "none",
        cursor: props.disabled ? "not-allowed" : "pointer",
        "font-weight": "500",
        "font-size": BTN_FONT[props.size ?? "2"] ?? BTN_FONT["2"],
        "letter-spacing": "-0.15px",
        "background-color": isSoft() ? (BTN_SOFT_BG[col()] ?? BTN_SOFT_BG.blue) : (BTN_BG[col()] ?? BTN_BG.blue),
        color: isSoft() ? (BTN_BG[col()] ?? BTN_BG.blue) : "white",
        opacity: props.disabled ? 0.5 : 1,
        ...props.style,
      }}
    >
      {props.children}
    </button>
  )
}

export function Toggle(props: {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: "1" | "2" | "3"
}) {
  return (
    <button
      role="switch"
      aria-checked={props.checked ? "true" : "false"}
      onClick={() => props.onCheckedChange?.(!props.checked)}
      class="toggle-root"
    >
      <span class="toggle-thumb" />
    </button>
  )
}

export function Separator(_: { size?: string; orientation?: "horizontal" | "vertical" }) {
  return <hr style={{ border: "none", "border-top": "1px solid #e2e8f0", margin: 0, width: "100%" }} />
}

function SelectRoot(props: {
  value?: string
  onValueChange?: (v: string) => void
  children: JSX.Element
}) {
  return (
    <select value={props.value} onChange={(e) => props.onValueChange?.(e.currentTarget.value)}>
      {props.children}
    </select>
  )
}
function SelectTrigger() { return null as unknown as JSX.Element }
function SelectContent(props: { children: JSX.Element }) { return props.children as JSX.Element }
function SelectItem(props: { value: string; children: JSX.Element }) {
  return <option value={props.value}>{props.children}</option>
}

export const Select = { Root: SelectRoot, Trigger: SelectTrigger, Content: SelectContent, Item: SelectItem }
