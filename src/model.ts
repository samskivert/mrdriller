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
export const labeledBeat = (
  label: string,
  ...strokes: StrokeOrRest[]
): Beat => ({
  label,
  strokes,
})

/** A measure is some number of beats, to be spaced evenly in time. An array element can be
 * undefined which means nothing is done on that beat. */
export type Measure = (Beat | undefined)[]

/** Creates a simple measure that has a single unlabeled stroke on every beat. */
export const measure = (...strokes: StrokeOrRest[]): Measure =>
  strokes.map((stroke) => (stroke ? beat(stroke) : undefined))

/** A section is a collection of measures, with an optional label. The measures in a section are
 * rendered in a single horizontal line, with the label above it, and all surrounded by a box.
 * Sections may be repeated one or more times. */
export type Section = {
  label?: string
  measures: Measure[]
  repeat: number
}

export const section = (
  label: string,
  repeat: number,
  ...measures: Measure[]
) => ({ label, measures, repeat })

/** A row is a collection of sections that are displayed horizontally in a single row. */
export type Row = Section[]

export type Drill = {
  title: string
  bpm: number // beats per measure
  rows: Row[]
}
