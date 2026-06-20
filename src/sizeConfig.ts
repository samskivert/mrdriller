import { Drill, Section } from "./model"

export type SizeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type RadixTextSize = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

export type SizeConfig = {
  strokeSize: number
  measureGap: number
  cardPadding: number
  labelSize: RadixTextSize
  repeatSize: RadixTextSize
}

// Size 9: strokeSize=192, size 1: strokeSize=28 (matches DrillOverviewView)
// Label/repeat sizes map to Radix UI Text sizes (see ui.tsx FONT_SIZE for pixel values)
export const SIZE_CONFIGS: { [K in SizeLevel]: SizeConfig } = {
  1: { strokeSize:  28, measureGap:  4, cardPadding:  8, labelSize: "2", repeatSize: "2" },
  2: { strokeSize:  48, measureGap:  5, cardPadding: 10, labelSize: "3", repeatSize: "3" },
  3: { strokeSize:  68, measureGap:  6, cardPadding: 12, labelSize: "4", repeatSize: "4" },
  4: { strokeSize:  90, measureGap:  8, cardPadding: 14, labelSize: "5", repeatSize: "5" },
  5: { strokeSize: 110, measureGap: 10, cardPadding: 16, labelSize: "6", repeatSize: "6" },
  6: { strokeSize: 130, measureGap: 12, cardPadding: 18, labelSize: "7", repeatSize: "7" },
  7: { strokeSize: 150, measureGap: 13, cardPadding: 20, labelSize: "7", repeatSize: "8" },
  8: { strokeSize: 172, measureGap: 14, cardPadding: 22, labelSize: "8", repeatSize: "8" },
  9: { strokeSize: 192, measureGap: 16, cardPadding: 24, labelSize: "9", repeatSize: "9" },
}

const STROKE_MARGIN = 8 // 4px margin on each side in StrokeView
const OUTER_MARGIN = 48 // container padding, card borders, etc.

/** Compute the best size level for a single section to fit within the given window width. */
function computeSectionLevel(section: Section, windowWidth: number, minLevel: SizeLevel): SizeLevel {
  const totalBeats = section.measures.reduce((sum, m) => sum + m.length, 0)
  const numMeasures = section.measures.length

  for (let level = 9; level >= minLevel; level--) {
    const config = SIZE_CONFIGS[level as SizeLevel]
    const beatWidth = config.strokeSize + STROKE_MARGIN
    const contentWidth =
      totalBeats * beatWidth + (numMeasures - 1) * config.measureGap
    const totalWidth = contentWidth + config.cardPadding * 2 + OUTER_MARGIN
    if (totalWidth <= windowWidth) return level as SizeLevel
  }
  return minLevel
}

/** Compute a uniform size level for an entire drill, using the smallest level needed by any section. */
export function computeDrillSizeLevel(drill: Drill, windowWidth: number): SizeLevel {
  const minLevel = Math.min(9, Math.max(1, Math.round(windowWidth / 512) + 1)) as SizeLevel
  let level: SizeLevel = 9
  for (const row of drill.rows) {
    for (const section of row) {
      const sectionLevel = computeSectionLevel(section, windowWidth, minLevel)
      if (sectionLevel < level) level = sectionLevel
    }
  }
  return level
}
