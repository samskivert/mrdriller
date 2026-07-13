// Defines a data model for drills

type Hand = "L" | "R"
type Dir = "U" | "D"

/** Represents a single stroke. Usually this is a strike (up and down), but can be just the down
 * stroke or the up stroke. */
export type Stroke = {
  hand: Hand
  accent: boolean
  dir?: Dir
}

export const hit = (hand: Hand, accent = false): Stroke => ({ hand, accent })
export const downStroke = (hand: Hand, accent = false): Stroke => ({
  hand,
  accent,
  dir: "D",
})
export const upStroke = (hand: Hand): Stroke => ({
  hand,
  accent: false,
  dir: "U",
})

export const R = hit("R", true)
export const r = hit("R")
export const L = hit("L", true)
export const l = hit("L")

export const rd = downStroke("R")
export const ru = upStroke("R")
export const ld = downStroke("L")
export const lu = upStroke("L")

/** A beat contains everything that happens on a particular beat. Usually this is just a single
 * strike, but some drills break out one hand doing the up stroke on a beat while another does the
 * down stroke on that beat. And a beat can be labeled (which is shown above the strokes).
 * Strokes can be undefined, which will leave an empty space in the visualization. */
export type Beat = {
  label?: string
  strokes: (Stroke | undefined)[]
}

type StrokeOrRest = Stroke | undefined

export const beat = (...strokes: StrokeOrRest[]): Beat => ({ strokes })
export const labeledBeat = (label: string, ...strokes: StrokeOrRest[]): Beat => ({
  label,
  strokes,
})

/** A measure is some number of beats, to be spaced evenly in time. An array element can be
 * undefined which means nothing is done on that beat. */
export type Measure = (Beat | undefined)[]

/** Creates a simple measure that has a single unlabeled stroke on every beat. */
export const measure = (...strokes: StrokeOrRest[]): Measure =>
  strokes.map((stroke) => (stroke ? beat(stroke) : undefined))

/** A line is a collection of measures that we try to render on a single horizontal line. */
export type Line = {
  measures: Measure[]
}

export const line = (...measures: Measure[]) => ({ measures })

/** A section is a collection of lines, with an optional label. The lines in a section are rendered
  * in a vertical list, with the label above it, and all surrounded by a box. Sections may be
  * repeated one or more times. */
export type Section = {
  label?: string
  lines: Line[]
  repeat: number
}

export const section = (label: string, repeat: number, ...lines: Line[]) => ({
  label,
  lines,
  repeat,
})

export const oneLineSection = (label: string, repeat: number, ...measures: Measure[]) =>
  section(label, repeat, { measures })

/** A row is a collection of sections that are displayed horizontally in a single row. */
export type Row = Section[]

export type Drill = {
  id: string
  title: string
  bpm: number // beats per measure
  beeps?: number[] // beats on which to beep
  scale?: number // scales the quarter note duration (default is 1)
  forceIntro?: boolean // always show ichi-ni-so-re (vs only on BPM increase)
  rows: Row[]
}
export type Pos = {
  row: number
  section: number
  line: number
  measure: number
  offset: number
  repeat: number
}

const swapHand = (hand: Hand): Hand => (hand == "L" ? "R" : "L")
const swapStrokeHands = (stroke: Stroke | undefined): Stroke | undefined =>
  stroke === undefined ? undefined : { ...stroke, hand: swapHand(stroke.hand) }
const swapBeatHands = (beat: Beat | undefined): Beat | undefined =>
  beat === undefined ? undefined : { ...beat, strokes: beat.strokes.map(swapStrokeHands) }
const swapMeasureHands = (measure: Measure): Measure => measure.map(swapBeatHands)
const swapLineHands = (line: Line) :Line => ({ measures: line.measures.map(swapMeasureHands) })

/** Swaps the L and R hands in a section. */
export const swapSectionHands = (section: Section): Section => ({
  ...section,
  lines: section.lines.map(swapLineHands),
})

const swapRowHands = (row: Row): Row => row.map(swapSectionHands)

/** Swaps the L and R hands in a drill. */
export const swapHands = (drill: Drill): Drill => ({ ...drill, rows: drill.rows.map(swapRowHands) })

export const MAX_BPM = 250

/** Compute the total duration of a drill in seconds. */
export function computeDrillDuration(
  drill: Drill,
  bpm: number,
  bpmIncrease: number,
  drillRepeat: number,
  replayIntroOnBpmIncrease = true,
): number {
  // Count the total beats for one pass through the drill (excluding intro)
  let drillBeats = 0
  for (const row of drill.rows) {
    for (const section of row) {
      for (let rep = 0; rep < section.repeat; rep++) {
        for (const line of section.lines) {
          for (const measure of line.measures) {
            drillBeats += measure.length
          }
        }
      }
    }
  }

  const introBeats = drill.bpm * 4
  const scale = drill.scale ?? 1
  let totalSeconds = 0

  for (let rep = 0; rep < drillRepeat; rep++) {
    const currentBpm = Math.min(MAX_BPM, bpm + bpmIncrease * rep)
    const tickMs = (60 * 1000) / currentBpm / 4 * scale

    // First repeat always has intro; subsequent repeats have intro if bpmIncrease > 0 (and the
    // setting allows it) or forceIntro
    const hasIntro = rep === 0 || (bpmIncrease > 0 && replayIntroOnBpmIncrease) || (drill.forceIntro ?? false)
    const beats = drillBeats + (hasIntro ? introBeats : 0)
    totalSeconds += (beats * tickMs) / 1000
  }

  return totalSeconds
}

// defines a data model for tools

export type Tool = {
  id: string
  title: string
}

// defines a data model for activities (tools or drills)

export type Activity = ({ type: "tool" } & Tool) | ({ type: "drill" } & Drill)

// the set of actions views use to move between screens

export type Navigation = {
  selectActivity: (activity: Activity) => void
  openSettings: () => void
  back: () => void
}
