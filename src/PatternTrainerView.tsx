import { createSignal, createEffect, createMemo, onMount, onCleanup, on, Show, Switch, Match } from "solid-js"
import { NumberInput, CenteredContainer, CountdownSection, HighlightedCard, BackButton } from "./components"
import { MetronomeSounds } from "./MetronomeSounds"
import { Stroke, Section, Measure, hit, Pos, beat, swapSectionHands, section, line, Navigation } from "./model"
import { SectionView } from "./SectionView"
import { Flex, Text, Heading, Button, Toggle, Select, Box } from "./ui"

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

const Playing = { ...NotPlaying, playing: true, intro: true, mode: "listen" as Mode }

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
    if (saved) return JSON.parse(saved) as PatternTrainerConfig
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
function ModeView(props: { mode: Mode }) {
  return (
    <HighlightedCard isHighlighted={true} minHeight={100}>
      <Flex align="center" justify="center" gap="8">
        <Text size="9" weight="bold" color="blue" style={{ "text-align": "center" }}>
          {props.mode === "listen" ? "Listen" : "Repeat"}
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
    if (this.pool.length === 0) this.pool = generateAllPossibleMeasures()
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
    measures = [measurePool.getMeasure(), measurePool.getMeasure(), measurePool.getMeasure(), measurePool.getMeasure()]
  }
  return section("", 1, line(measures[0], measures[1]), line(measures[2], measures[3]))
}

function flatMeasures(pattern: Section): Measure[] {
  return pattern.lines.flatMap((l) => l.measures)
}

export function PatternTrainerView(props: { nav: Navigation }) {
  const [bpm, setBpm] = createSignal(60)
  const [difficulty, setDifficulty] = createSignal<Difficulty>("easy")
  const [numPatterns, setNumPatterns] = createSignal(5)
  const [swapHands, setSwapHands] = createSignal(false)
  const [sectionVisibility, setSectionVisibility] = createSignal<SectionVisibility>("show-all")
  const [state, setState] = createSignal<State>(NotPlaying)
  const [patterns, setPatterns] = createSignal<Section[]>([])

  // Load config on mount
  onMount(() => {
    const config = loadConfig()
    setBpm(config.bpm)
    setDifficulty(config.difficulty)
    setNumPatterns(config.numPatterns)
    setSwapHands(config.swapHands)
    setSectionVisibility(config.sectionVisibility)
  })

  // Save config when values change, but not on initial mount.
  createEffect(
    on(
      [bpm, difficulty, numPatterns, swapHands, sectionVisibility],
      () => {
        saveConfig({
          bpm: bpm(),
          difficulty: difficulty(),
          numPatterns: numPatterns(),
          swapHands: swapHands(),
          sectionVisibility: sectionVisibility(),
        })
      },
      { defer: true },
    ),
  )

  let intervalRef: number | null = null
  let soundsRef: MetronomeSounds | null = null

  // Initialize metronome sounds
  onMount(() => {
    soundsRef = new MetronomeSounds()
    onCleanup(() => soundsRef?.dispose())
  })

  function playStroke(stroke: Stroke | undefined) {
    if (soundsRef && stroke) {
      if (stroke.accent) soundsRef.playBeep()
      else soundsRef.playBoop()
    }
  }

  createEffect(() => {
    const s = state()
    if (!s.playing || !s.intro || !soundsRef) return
    const beatInMeasure = s.beat % BEATS_PER_MEASURE
    if (beatInMeasure === 0) soundsRef.playBeep()
    else soundsRef.playBoop()
  })

  const ptPlaying = createMemo(() => state().playing)
  const ptBpm = createMemo(() => state().bpm)

  createEffect(() => {
    if (!ptPlaying()) soundsRef?.pause()
  })

  createEffect(() => {
    if (!ptPlaying() || patterns().length === 0) {
      if (intervalRef) {
        window.clearInterval(intervalRef)
        intervalRef = null
      }
      return
    }

    // Calculate quarter note duration in milliseconds (1/4 beat)
    const noteDuration = (60 * 1000) / ptBpm() / 4
    const tickDelay = noteDuration

    intervalRef = window.setInterval(() => {
      setState((prev) => {
        const next = { ...prev, beat: prev.beat + 1 }
        const beatsPerMeasure = 4
        const introBeats = beatsPerMeasure * 4 // 4 measures for intro

        // Check whether the intro is over
        if (prev.intro && next.beat < introBeats) return next
        if (prev.intro && next.beat === introBeats) {
          next.intro = false
          next.mode = "listen" as Mode
          next.measure = 0
          next.offset = 0
          // Play sound for the first beat of the first pattern
          playStroke(flatMeasures(patterns()[prev.pattern])[0][0]?.strokes[0])
          return next
        }

        const currentPattern = patterns()[prev.pattern]
        const currentMeasures = flatMeasures(currentPattern)
        const currentMeasure = currentMeasures[prev.measure]

        // Calculate next position
        let nextOffset = prev.offset + 1
        let nextMeasure = prev.measure
        let nextPattern = prev.pattern
        let nextMode: Mode = prev.mode

        if (nextOffset >= currentMeasure.length) {
          nextOffset = 0
          nextMeasure = prev.measure + 1
          if (nextMeasure >= currentMeasures.length) {
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
              if (nextPattern >= patterns().length) return NotPlaying
            }
          }
        }

        // Play sound for the beat we're moving to (only in Listen mode, not Repeat mode)
        if (!next.intro && nextMode === "listen") {
          const measureToPlay = flatMeasures(patterns()[nextPattern])[nextMeasure]
          playStroke(measureToPlay[nextOffset]?.strokes[0])
        }

        next.offset = nextOffset
        next.measure = nextMeasure
        next.pattern = nextPattern
        next.mode = nextMode
        return next
      })
    }, tickDelay)

    onCleanup(() => {
      if (intervalRef) {
        window.clearInterval(intervalRef)
        intervalRef = null
      }
    })
  })

  const handleStart = () => {
    soundsRef?.resume()
    const measurePool = new MeasurePool()
    const newPatterns: Section[] = []
    for (let i = 0; i < numPatterns(); i++) {
      newPatterns.push(generatePattern(difficulty(), measurePool))
    }
    setPatterns(newPatterns)
    setState({ ...Playing, bpm: bpm(), mode: "listen" as Mode })
  }

  const handleStop = () => setState(NotPlaying)

  const empty = "○"
  function mkRepeat(current: number, total: number) {
    return "●".repeat(current + 1) + empty.repeat(total - current - 1)
  }

  function mkPatternView(pattern: Section, patternIndex: number) {
    const isHighlighted = () => state().playing && state().pattern === patternIndex
    const repeatDisplay = () => {
      const total = pattern.repeat ?? 1
      if (total <= 1) return undefined
      return isHighlighted() ? mkRepeat(state().repeat, total) : empty.repeat(total)
    }

    const highlight = (): Pos | undefined =>
      state().playing && state().pattern === patternIndex
        ? {
            row: 0,
            section: 0,
            line: Math.floor(state().measure / 2),
            measure: state().measure % 2,
            offset: state().offset,
            repeat: state().repeat,
          }
        : undefined

    return (
      <Box>
        <SectionView
          section={pattern}
          isHighlighted={isHighlighted()}
          repeatDisplay={repeatDisplay()}
          highlight={highlight()}
        />
      </Box>
    )
  }

  const visibilityOk = () => {
    const s = state()
    const sv = sectionVisibility()
    return (
      sv === "show-all" ||
      (sv === "show-listen" && s.mode === "listen") ||
      (sv === "show-repeat" && s.mode === "repeat")
    )
  }

  return (
    <Flex direction="column" gap="6" style={{ padding: "24px", "min-height": "100dvh", "background-color": "white" }}>
      <Flex align="center" justify="between" wrap="wrap" gap="3">
        <BackButton nav={props.nav} />
        <Heading size="6" style={{ flex: 1, "text-align": "center" }}>
          Pattern Trainer
        </Heading>
        <Box style={{ "flex-shrink": 0, width: "80px" }} />
      </Flex>

      <CenteredContainer>
        <Flex align="center" justify="center" wrap="wrap" gap="6">
          <NumberInput label="BPM" value={bpm()} onChange={setBpm} min={30} max={120} width={60} />

          <Flex align="center" gap="2">
            <Text size="2" weight="medium">
              Difficulty:
            </Text>
            <Select.Root value={difficulty()} onValueChange={(v) => setDifficulty(v as Difficulty)}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="easy">Easy</Select.Item>
                <Select.Item value="medium">Medium</Select.Item>
                <Select.Item value="hard">Hard</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <NumberInput label="Patterns" value={numPatterns()} onChange={setNumPatterns} min={1} max={20} width={60} />

          <Text as="label">
            <Flex gap="2" align="center">
              <Toggle size="3" checked={swapHands()} onCheckedChange={setSwapHands} />
              L↔︎R
            </Flex>
          </Text>

          <Flex align="center" gap="2">
            <Text size="2" weight="medium">
              Show:
            </Text>
            <Select.Root
              value={sectionVisibility()}
              onValueChange={(v) => setSectionVisibility(v as SectionVisibility)}
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

          <Button color="green" size="2" onClick={handleStart} disabled={state().playing}>
            Start
          </Button>

          <Show when={state().playing}>
            <Button color="red" size="2" onClick={handleStop}>
              Stop
            </Button>
          </Show>
        </Flex>

        <Switch>
          <Match when={!state().playing || state().intro}>
            <CountdownSection beat={state().beat} beatsPerMeasure={4} intro={state().intro} />
          </Match>
          <Match when={patterns().length > 0 && state().pattern < patterns().length}>
            <Flex direction="column" gap="4">
              <ModeView mode={state().mode} />
              <Show when={visibilityOk()}>
                {mkPatternView(
                  swapHands() ? swapSectionHands(patterns()[state().pattern]) : patterns()[state().pattern],
                  state().pattern,
                )}
              </Show>
            </Flex>
          </Match>
        </Switch>
      </CenteredContainer>
    </Flex>
  )
}
