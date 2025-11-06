import { Button, Flex, Text, Box } from "@radix-ui/themes"
import * as React from "react"
import { HighlightedCard, NumberInput, CenteredContainer } from "./components"
import { MetronomeSounds } from "./MetronomeSounds"
import { Drill, Section } from "./model"
import { SectionView } from "./SectionView"

type State = {
  playing: boolean
  intro: boolean
  beat: number
  row: number
  section: number
  measure: number
  offset: number
  repeat: number
  drillRepeat: number
  bpm: number
  bpmIncrease: number
}

const NotPlaying: State = {
  playing: false,
  intro: false,
  beat: 0,
  row: 0,
  section: 0,
  measure: 0,
  offset: 0,
  repeat: 0,
  drillRepeat: 0,
  bpm: 60,
  bpmIncrease: 0,
}

const Playing = { ...NotPlaying, playing: true, intro: true }

const IntroText = ["Ichi - いち", "Ni - に", "So - そ〜", "Re - れ！"]

function IntroView({ drill, state }: { drill: Drill; state: State }) {
  const isHighlighted = state.playing && state.intro
  const measure = Math.floor(state.beat / drill.bpm)
  const introText =
    measure >= IntroText.length
      ? `${state.bpm} bpm, go!`
      : state.intro
        ? IntroText[measure]
        : "Get ready..."
  return (
    <HighlightedCard isHighlighted={isHighlighted} minHeight={100}>
      <Text
        size="9"
        weight="bold"
        color={isHighlighted ? "blue" : "gray"}
        style={{ textAlign: "center" }}
      >
        {introText}
      </Text>
    </HighlightedCard>
  )
}

type DrillConfig = {
  bpm: number
  bpmIncrease: number
  drillRepeat: number
}

// Load config from localStorage or use defaults
function loadConfig(drillId: string): DrillConfig {
  try {
    const saved = localStorage.getItem(`config.${drillId}`)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.warn("Failed to load drill config:", error)
  }
  return { bpm: 60, bpmIncrease: 0, drillRepeat: 1 }
}

function saveConfig(drillId: string, config: DrillConfig) {
  try {
    localStorage.setItem(`config.${drillId}`, JSON.stringify(config))
  } catch (error) {
    console.warn("Failed to save drill config:", error)
  }
}

export function PracticeView({ drill }: { drill: Drill }) {
  const [bpm, setBpm] = React.useState(60)
  const [bpmIncrease, setBpmIncrease] = React.useState(0)
  const [drillRepeat, setDrillRepeat] = React.useState(1)
  const [state, setState] = React.useState<State>(NotPlaying)
  const [configLoaded, setConfigLoaded] = React.useState(false)

  // Load config on mount
  React.useEffect(() => {
    const config = loadConfig(drill.id)
    setBpm(config.bpm)
    setBpmIncrease(config.bpmIncrease)
    setDrillRepeat(config.drillRepeat)
    setConfigLoaded(true)
  }, [drill.id])

  // Save config whenever values change (but only after config has been loaded)
  React.useEffect(() => {
    if (configLoaded) {
      saveConfig(drill.id, { bpm, bpmIncrease, drillRepeat })
    }
  }, [bpm, bpmIncrease, drillRepeat, drill.id, configLoaded])

  const intervalRef = React.useRef<number | null>(null)
  const soundsRef = React.useRef<MetronomeSounds | null>(null)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // Initialize metronome sounds
  React.useEffect(() => {
    soundsRef.current = new MetronomeSounds()
    return () => {
      soundsRef.current?.dispose()
    }
  }, [])

  // Calculate quarter note duration in milliseconds (1/4 beat)
  const noteDuration = (60 * 1000) / state.bpm / 4
  const tickDelay = noteDuration * (drill.scale ?? 1)

  // Play metronome sound when beat changes
  React.useEffect(() => {
    if (state.playing && soundsRef.current) {
      // Play sound based on current beat (beat 0 = 1st beat, beat 2 = 3rd beat)
      const beatInMeasure = state.beat % drill.bpm
      const beeps = drill.beeps
      if (beeps) {
        if (beeps.includes(beatInMeasure + 1)) {
          if (beatInMeasure + 1 === beeps[0]) soundsRef.current.playBeep()
          else soundsRef.current.playBoop()
        }
      } else {
        // Beat 1: higher pitch beep
        if (beatInMeasure === 0) soundsRef.current.playBeep()
        // Every other beat: lower pitch boop
        else soundsRef.current.playBoop()
      }
    }
  }, [state.playing, state.beat])

  // Auto-scroll to active section
  React.useEffect(() => {
    if (state.playing && scrollContainerRef.current) {
      const activeSectionElement = scrollContainerRef.current.querySelector(
        `[data-section-index="${state.section}"][data-row-index="${state.row}"]`,
      )
      if (activeSectionElement) {
        const containerRect = scrollContainerRef.current.getBoundingClientRect()
        const elementRect = activeSectionElement.getBoundingClientRect()

        // Calculate the scroll position to center the element
        const scrollTop =
          scrollContainerRef.current.scrollTop +
          (elementRect.top - containerRect.top) -
          containerRect.height / 2 +
          elementRect.height / 2

        scrollContainerRef.current.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        })
      }
    }
  }, [state.playing, state.section, state.row])

  React.useEffect(() => {
    if (state.playing) {
      intervalRef.current = window.setInterval(() => {
        setState((prev) => {
          const next = { ...prev, beat: prev.beat + 1 }
          const row = drill.rows[prev.row]
          const section = row[prev.section]
          const measure = section.measures[prev.measure]

          // Check whether the intro is over
          if (prev.intro && next.beat < drill.bpm * 4) return next
          next.intro = false
          if (next.beat == drill.bpm * 4) return next

          // Check if we've finished all beats in current measure
          next.offset = prev.offset + 1
          if (next.offset < measure.length) return next
          next.offset = 0

          // Move to next measure or handle section completion
          next.measure = prev.measure + 1
          if (next.measure < section.measures.length) return next
          next.measure = 0

          // Finished all measures in section, move to next repeat or next section
          next.repeat = prev.repeat + 1
          if (next.repeat < section.repeat) return next
          next.repeat = 0

          // Move to next section in the same row
          next.section = prev.section + 1
          if (next.section < row.length) return next
          next.section = 0

          // Move to next row
          next.row = prev.row + 1
          if (next.row < drill.rows.length) return next
          next.row = 0

          // Finished all rows - check if we should repeat the drill
          next.drillRepeat = prev.drillRepeat + 1
          if (next.drillRepeat < drillRepeat) {
            // Increase BPM by the bpmIncrease amount for the next repeat
            next.bpm = Math.min(200, prev.bpm + prev.bpmIncrease)
            // If we're increasing BPM, show the intro again to establish the new time
            if (prev.bpmIncrease > 0 || drill.forceIntro) {
              next.beat = 0
              next.intro = true
            }
            return next
          }

          // Finished all drill repeats
          return NotPlaying
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
  }, [state, drill.rows.length, drillRepeat])

  const handleStartStop = () => {
    if (state.playing) {
      setState(NotPlaying)
    } else {
      // Copy current BPM and BPM Increase values into state when starting
      setState({
        ...Playing,
        bpm: bpm,
        bpmIncrease: bpmIncrease,
      })
    }
  }

  const empty = "○"
  function mkRepeat(current :number, total :number) {
    return "●".repeat(current+1) + empty.repeat(total-current-1)
  }

  function mkSectionView(section: Section, rowIndex: number, sectionIndex: number) {
    const isHighlighted =
      state.playing && !state.intro && state.row === rowIndex && state.section === sectionIndex
    const repeatDisplay =
      isHighlighted
        ? mkRepeat(state.repeat, section.repeat ?? 1)
        : empty.repeat(section.repeat ?? 1)

    return (
      <Box
        key={`${rowIndex}-${sectionIndex}`}
        data-section-index={sectionIndex}
        data-row-index={rowIndex}
      >
        <SectionView
          section={section}
          isHighlighted={isHighlighted}
          repeatDisplay={repeatDisplay}
          highlight={state.playing ? state : undefined}
        />
      </Box>
    )
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Scrollable sections area */}
      <div ref={scrollContainerRef} style={{ flex: "1", overflow: "auto", padding: "16px" }}>
        <CenteredContainer>
          <IntroView drill={drill} state={state} />
          {drill.rows.flatMap((row, rowIndex) =>
            row.map((section, sectionIndex) => mkSectionView(section, rowIndex, sectionIndex)),
          )}
        </CenteredContainer>
      </div>

      {/* Controls at bottom - natural height */}
      <div style={{ minHeight: "100px", padding: "16px", borderTop: "1px solid var(--gray-6)" }}>
        <Flex align="center" justify="center" gap="9">
          <NumberInput label="BPM" value={bpm} onChange={setBpm} min={30} max={200} width={60} />

          <NumberInput
            label="BPM Increase"
            value={bpmIncrease}
            onChange={setBpmIncrease}
            min={0}
            max={50}
            width={80}
          />

          <NumberInput
            label="Repeat"
            value={drillRepeat}
            onChange={setDrillRepeat}
            min={1}
            max={10}
            width={60}
          />

          <Button onClick={handleStartStop} color={state.playing ? "red" : "green"} size="2">
            {state.playing ? "Stop" : "Start"}
          </Button>
        </Flex>
      </div>
    </div>
  )
}
