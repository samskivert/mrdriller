import { Button, Flex, Text, Box, Switch, Select, Heading } from "@radix-ui/themes"
import * as React from "react"
import { NumberInput, CenteredContainer, CountdownSection, HighlightedCard } from "./components"
import { MetronomeSounds } from "./MetronomeSounds"
import { Stroke, Section, Measure, hit, Pos, beat, swapSectionHands } from "./model"
import { SectionView } from "./SectionView"

type Difficulty = "easy" | "medium" | "hard"

type Mode = "listen" | "repeat"

type SectionVisibility = "show-all" | "show-listen" | "show-repeat" | "dont-show"

type State = {
  playing: boolean
  intro: boolean
  mode: Mode
  beat: number
  pattern: number
  measure: number
  offset: number
  repeat: number
  bpm: number
}

const NotPlaying: State = {
  playing: false,
  intro: false,
  mode: "listen",
  beat: 0,
  pattern: 0,
  measure: 0,
  offset: 0,
  repeat: 0,
  bpm: 60,
}

const Playing = { ...NotPlaying, playing: true, intro: true, mode: "listen" }

const BEATS_PER_MEASURE = 4

type PatternTrainerConfig = {
  bpm: number
  difficulty: Difficulty
  numPatterns: number
  swapHands: boolean
  sectionVisibility: SectionVisibility
}

// Load config from localStorage or use defaults
function loadConfig(): PatternTrainerConfig {
  try {
    const saved = localStorage.getItem("config.pattern-trainer")
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.warn("Failed to load pattern trainer config:", error)
  }
  return {
    bpm: 60,
    difficulty: "easy",
    numPatterns: 5,
    swapHands: false,
    sectionVisibility: "show-all",
  }
}

function saveConfig(config: PatternTrainerConfig) {
  try {
    localStorage.setItem("config.pattern-trainer", JSON.stringify(config))
  } catch (error) {
    console.warn("Failed to save pattern trainer config:", error)
  }
}

// ModeView component to show Listen/Repeat mode
function ModeView({ mode }: { mode: Mode }) {
  const modeText = mode === "listen" ? "Listen" : "Repeat"
  return (
    <HighlightedCard isHighlighted={true} minHeight={100}>
      <Flex align="center" justify="center" gap="8">
        <Text size="9" weight="bold" color="blue" style={{ textAlign: "center" }}>
          {modeText}
        </Text>
      </Flex>
    </HighlightedCard>
  )
}

// Generate all possible measures (2^4 = 16 combinations of accents)
function generateAllPossibleMeasures(): Measure[] {
  const measures: Measure[] = []
  // Each of the 4 beats can be accented or not: 2^4 = 16 combinations
  for (let ii = 0; ii < 16; ii++) {
    const measure: Measure = []
    for (let jj = 0; jj < BEATS_PER_MEASURE; jj++) {
      const hand = jj % 2 == 0 ? "R" : "L"
      // Check if bit jj is set (accent) or not (no accent)
      const accent = (ii & (1 << jj)) !== 0
      measure.push(beat(hit(hand, accent)))
    }
    measures.push(measure)
  }
  return measures
}

// Measure pool that picks a random measure each time and removes it
class MeasurePool {
  private pool: Measure[] = []

  getMeasure(): Measure {
    if (this.pool.length === 0) {
      this.pool = generateAllPossibleMeasures()
    }
    const randomIndex = Math.floor(Math.random() * this.pool.length)
    const measure = this.pool[randomIndex]
    this.pool.splice(randomIndex, 1)
    return measure
  }
}

// Generate a single pattern (section with 4 measures)
// Patterns always use R L R L sticking
function generatePattern(difficulty: Difficulty, measurePool: MeasurePool): Section {
  let measures: Measure[]

  if (difficulty === "easy") {
    // Same measure repeated 4 times
    const measure = measurePool.getMeasure()
    measures = [measure, measure, measure, measure]
  } else if (difficulty === "medium") {
    // Two different measures, then repeat those two
    const measure1 = measurePool.getMeasure()
    const measure2 = measurePool.getMeasure()
    measures = [measure1, measure2, measure1, measure2]
  } else {
    // Hard: all 4 measures can be different
    measures = [
      measurePool.getMeasure(),
      measurePool.getMeasure(),
      measurePool.getMeasure(),
      measurePool.getMeasure(),
    ]
  }

  return {
    label: undefined,
    measures,
    repeat: 1,
  }
}

export function PatternTrainerView({ onBack }: { onBack: () => void }) {
  const [bpm, setBpm] = React.useState(60)
  const [difficulty, setDifficulty] = React.useState<Difficulty>("easy")
  const [numPatterns, setNumPatterns] = React.useState(5)
  const [swapHands, setSwapHands] = React.useState(false)
  const [sectionVisibility, setSectionVisibility] = React.useState<SectionVisibility>("show-all")
  const [state, setState] = React.useState<State>(NotPlaying)
  const [patterns, setPatterns] = React.useState<Section[]>([])
  const [configLoaded, setConfigLoaded] = React.useState(false)

  // Load config on mount
  React.useEffect(() => {
    const config = loadConfig()
    setBpm(config.bpm)
    setDifficulty(config.difficulty)
    setNumPatterns(config.numPatterns)
    setSwapHands(config.swapHands)
    setSectionVisibility(config.sectionVisibility)
    setConfigLoaded(true)
  }, [])

  // Save config whenever values change (but only after config has been loaded)
  React.useEffect(() => {
    if (configLoaded) {
      saveConfig({ bpm, difficulty, numPatterns, swapHands, sectionVisibility })
    }
  }, [bpm, difficulty, numPatterns, swapHands, sectionVisibility, configLoaded])

  const intervalRef = React.useRef<number | null>(null)
  const soundsRef = React.useRef<MetronomeSounds | null>(null)

  // Initialize metronome sounds
  React.useEffect(() => {
    soundsRef.current = new MetronomeSounds()
    return () => {
      soundsRef.current?.dispose()
    }
  }, [])

  function playStroke(stroke: Stroke | undefined) {
    if (soundsRef.current && stroke) {
      if (stroke.accent) {
        soundsRef.current.playBeep()
      } else {
        soundsRef.current.playBoop()
      }
    }
  }

  // Calculate quarter note duration in milliseconds (1/4 beat)
  const noteDuration = (60 * 1000) / state.bpm / 4
  const tickDelay = noteDuration

  // Play metronome sound during intro
  React.useEffect(() => {
    if (state.playing && state.intro && soundsRef.current) {
      const beatsPerMeasure = 4
      const beatInMeasure = state.beat % beatsPerMeasure
      // Beat 1: higher pitch beep
      if (beatInMeasure === 0) soundsRef.current.playBeep()
      // Every other beat: lower pitch boop
      else soundsRef.current.playBoop()
    }
  }, [state.playing, state.intro, state.beat])

  React.useEffect(() => {
    if (state.playing && patterns.length > 0) {
      intervalRef.current = window.setInterval(() => {
        setState((prev) => {
          const next = { ...prev, beat: prev.beat + 1 }
          const beatsPerMeasure = 4
          const introBeats = beatsPerMeasure * 4 // 4 measures for intro

          // Check whether the intro is over
          if (prev.intro && next.beat < introBeats) return next
          if (prev.intro && next.beat == introBeats) {
            next.intro = false
            next.mode = "listen" as Mode
            next.measure = 0
            next.offset = 0
            // Play sound for the first beat of the first pattern
            playStroke(patterns[prev.pattern].measures[0][0]?.strokes[0])
            return next
          }

          const currentPattern = patterns[prev.pattern]
          const currentMeasure = currentPattern.measures[prev.measure]

          // Calculate next position
          let nextOffset = prev.offset + 1
          let nextMeasure = prev.measure
          let nextPattern = prev.pattern
          let nextMode: Mode = prev.mode

          if (nextOffset >= currentMeasure.length) {
            nextOffset = 0
            nextMeasure = prev.measure + 1
            if (nextMeasure >= currentPattern.measures.length) {
              // Pattern completed
              if (prev.mode === "listen") {
                // Switch to Repeat mode for the same pattern
                nextMode = "repeat"
                nextMeasure = 0
                nextOffset = 0
              } else {
                // Repeat mode completed, move to next pattern in Listen mode
                nextMode = "listen"
                nextMeasure = 0
                nextOffset = 0
                nextPattern = prev.pattern + 1
                if (nextPattern >= patterns.length) {
                  return NotPlaying
                }
              }
            }
          }

          // Play sound for the beat we're moving to (only in Listen mode, not Repeat mode)
          if (!next.intro && nextMode === "listen") {
            const measureToPlay = patterns[nextPattern].measures[nextMeasure]
            playStroke(measureToPlay[nextOffset]?.strokes[0])
          }

          // Update state
          next.offset = nextOffset
          next.measure = nextMeasure
          next.pattern = nextPattern
          next.mode = nextMode
          return next
        })
      }, tickDelay)
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state, patterns.length, tickDelay])

  const handleStart = () => {
    // Generate patterns (always R L R L, swapHands only affects display)
    // Use a measure pool to ensure no repeated measures
    const measurePool = new MeasurePool()
    const newPatterns: Section[] = []
    for (let i = 0; i < numPatterns; i++) {
      newPatterns.push(generatePattern(difficulty, measurePool))
    }
    setPatterns(newPatterns)

    // Start playing
    setState({
      ...Playing,
      bpm: bpm,
      mode: "listen" as Mode,
    })
  }

  const handleStop = () => {
    setState(NotPlaying)
  }

  const empty = "○"
  function mkRepeat(current: number, total: number) {
    return "●".repeat(current + 1) + empty.repeat(total - current - 1)
  }

  function mkPatternView(pattern: Section, patternIndex: number) {
    const isHighlighted = state.playing && state.pattern === patternIndex
    const repeatDisplay = isHighlighted
      ? mkRepeat(state.repeat, pattern.repeat ?? 1)
      : empty.repeat(pattern.repeat ?? 1)

    // Map state to Pos structure for SectionView
    const highlight: Pos | undefined =
      state.playing && state.pattern === patternIndex
        ? {
            row: 0,
            section: 0, // We only have one section per pattern
            measure: state.measure,
            offset: state.offset,
            repeat: state.repeat,
          }
        : undefined

    return (
      <Box key={patternIndex} data-pattern-index={patternIndex}>
        <SectionView
          section={pattern}
          isHighlighted={isHighlighted}
          repeatDisplay={repeatDisplay}
          highlight={highlight}
        />
      </Box>
    )
  }

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <Flex align="center" justify="between" wrap="wrap" gap="3">
        <Button variant="soft" onClick={onBack} style={{ flexShrink: 0 }}>
          ← Back
        </Button>
        <Heading size="6" style={{ flex: 1, textAlign: "center" }}>
          Pattern Trainer
        </Heading>
        <div style={{ flexShrink: 0, width: "80px" }} /> {/* Spacer for centering */}
      </Flex>

      <CenteredContainer>
        <Flex align="center" justify="center" wrap="wrap" gap="6">
          <NumberInput label="BPM" value={bpm} onChange={setBpm} min={30} max={200} width={60} />

          <Flex align="center" gap="2">
            <Text size="2" weight="medium">
              Difficulty:
            </Text>
            <Select.Root
              value={difficulty}
              onValueChange={(value) => setDifficulty(value as Difficulty)}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="easy">Easy</Select.Item>
                <Select.Item value="medium">Medium</Select.Item>
                <Select.Item value="hard">Hard</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <NumberInput
            label="Patterns"
            value={numPatterns}
            onChange={setNumPatterns}
            min={1}
            max={20}
            width={60}
          />

          <Text as="label">
            <Flex gap="2">
              <Switch size="3" checked={swapHands} onCheckedChange={setSwapHands} />
              L↔︎R
            </Flex>
          </Text>

          <Flex align="center" gap="2">
            <Text size="2" weight="medium">
              Show:
            </Text>
            <Select.Root
              value={sectionVisibility}
              onValueChange={(value) => setSectionVisibility(value as SectionVisibility)}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="show-all">All</Select.Item>
                <Select.Item value="show-listen">Listen</Select.Item>
                <Select.Item value="show-repeat">Repeat</Select.Item>
                <Select.Item value="dont-show">Never</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <Button onClick={handleStart} color="green" size="2" disabled={state.playing}>
            Start
          </Button>

          {state.playing && (
            <Button onClick={handleStop} color="red" size="2">
              Stop
            </Button>
          )}
        </Flex>

        {state.intro || !state.playing ? (
          <CountdownSection beat={state.beat} beatsPerMeasure={4} intro={state.intro} />
        ) : (
          patterns.length > 0 &&
          state.pattern < patterns.length && (
            <Flex direction="column" gap="4">
              <ModeView mode={state.mode} />
              {(sectionVisibility === "show-all" ||
                (sectionVisibility === "show-listen" && state.mode === "listen") ||
                (sectionVisibility === "show-repeat" && state.mode === "repeat")) &&
                mkPatternView(
                  swapHands ? swapSectionHands(patterns[state.pattern]) : patterns[state.pattern],
                  state.pattern,
                )}
            </Flex>
          )
        )}
      </CenteredContainer>
    </div>
  )
}
