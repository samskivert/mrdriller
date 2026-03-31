import { Button, Flex, Text, Switch } from "@radix-ui/themes"
import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { NumberInput, CenteredContainer, CountdownSection, HighlightedCard } from "./components"
import { MetronomeSounds } from "./MetronomeSounds"
import { Drill, Section, swapSectionHands } from "./model"
import { DrillOverView } from "./DrillOverviewView"
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

function DrillControls({
  bpm,
  setBpm,
  bpmIncrease,
  setBpmIncrease,
  drillRepeat,
  setDrillRepeat,
  swapHands,
  setSwapHands,
  onStart,
}: {
  bpm: number
  setBpm: (v: number) => void
  bpmIncrease: number
  setBpmIncrease: (v: number) => void
  drillRepeat: number
  setDrillRepeat: (v: number) => void
  swapHands: boolean
  setSwapHands: (v: boolean) => void
  onStart: () => void
}) {
  return (
    <Flex align="center" justify="center" wrap="wrap" gap="6">
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

      <Text as="label">
        <Flex gap="2">
          <Switch size="3" checked={swapHands} onCheckedChange={setSwapHands} />
          L↔︎R
        </Flex>
      </Text>

      <Button onClick={onStart} color="green" size="2">
        Start
      </Button>
    </Flex>
  )
}

function StatusView({
  bpm,
  bpmIncrease,
  drillRepeat,
  drillRepeatCount,
}: {
  bpm: number
  bpmIncrease?: number
  drillRepeat?: number
  drillRepeatCount?: number
}) {
  const drillProgress =
    drillRepeat &&
    drillRepeat > 1 &&
    drillRepeatCount !== undefined ? (
      <Text size="7" weight="bold" color="gray">
        {drillRepeatCount + 1} / {drillRepeat}
      </Text>
    ) : undefined
  return (
    <Flex align="center" justify="center" gap="4">
      <Text size="7" weight="bold" color="gray">
        {bpm} bpm {bpmIncrease ? ` (+${bpmIncrease})` : ""}
      </Text>
      {drillProgress}
    </Flex>
  )
}

function AnimatedSection({ sectionKey, children }: { sectionKey: string; children: React.ReactNode }) {
  return (
    <motion.div
      key={sectionKey}
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, pointerEvents: "none" as const, transition: { duration: 0 } }}
      transition={{
        layout: { duration: 0.3, ease: "easeInOut" },
        opacity: { duration: 0.3, ease: "easeInOut", delay: 0.3 },
        y: { duration: 0.3, ease: "easeInOut" },
      }}
    >
      {children}
    </motion.div>
  )
}

export function PracticeView({ drill }: { drill: Drill }) {
  const [bpm, setBpm] = React.useState(60)
  const [bpmIncrease, setBpmIncrease] = React.useState(0)
  const [drillRepeat, setDrillRepeat] = React.useState(1)
  const [swapHands, setSwapHands] = React.useState(false)
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
  const wakeLockRef = React.useRef<WakeLockSentinel | null>(null)

  // Acquire/release wake lock based on playing state
  React.useEffect(() => {
    if (state.playing && "wakeLock" in navigator) {
      navigator.wakeLock.request("screen").then((lock) => {
        wakeLockRef.current = lock
      }).catch(() => {})
    }
    return () => {
      wakeLockRef.current?.release()
      wakeLockRef.current = null
    }
  }, [state.playing])
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

  const handleStart = () => {
    setState({
      ...Playing,
      bpm: bpm,
      bpmIncrease: bpmIncrease,
    })
  }

  const empty = "○"
  function mkRepeat(current: number, total: number) {
    return "●".repeat(current + 1) + empty.repeat(total - current - 1)
  }

  // Flatten all sections into a linear list for navigation
  const allSections: { section: Section; rowIndex: number; sectionIndex: number }[] = drill.rows.flatMap(
    (row, rowIndex) => row.map((section, sectionIndex) => ({ section, rowIndex, sectionIndex }))
  )

  // Find the current flat index
  const currentFlatIndex = allSections.findIndex(
    (s) => s.rowIndex === state.row && s.sectionIndex === state.section
  )

  // Determine if we will repeat after this drill pass
  const willRepeatDrill = state.drillRepeat + 1 < drillRepeat
  const willRepeatWithIntro = willRepeatDrill && (state.bpmIncrease > 0 || drill.forceIntro)
  const idx = currentFlatIndex >= 0 ? currentFlatIndex : 0
  const isLastSection = idx === allSections.length - 1

  function mkSectionView(section: Section, isHighlighted: boolean) {
    const repeatDisplay = isHighlighted
      ? mkRepeat(state.repeat, section.repeat ?? 1)
      : empty.repeat(section.repeat ?? 1)

    return (
      <SectionView
        section={section}
        isHighlighted={isHighlighted}
        repeatDisplay={repeatDisplay}
        highlight={isHighlighted && state.playing ? state : undefined}
      />
    )
  }

  // Compute a unique key for the countdown that includes the drill repeat so
  // each repeat's countdown is treated as a distinct element.
  const countdownKey = `countdown-${state.drillRepeat}`

  function countdownSection() {
    const isBpmUp = state.drillRepeat > 0 && state.bpmIncrease > 0
    const isRepeat = state.drillRepeat > 0
    return (
      <CountdownSection
        beat={state.beat}
        beatsPerMeasure={drill.bpm}
        intro={state.intro}
        preText={isBpmUp ? "BPM up!" : isRepeat ? "Back to the start!" : "Get ready..."}
      />
    )
  }

  function renderSections() {
    const effectiveIdx = currentFlatIndex >= 0 ? currentFlatIndex : 0
    const current = allSections[effectiveIdx]
    const currentSection = swapHands ? swapSectionHands(current.section) : current.section
    const currentKey = `section-${effectiveIdx}-${state.drillRepeat}`

    const elements: React.ReactNode[] = []

    if (state.intro && state.drillRepeat == 0) {
      // don't animate the countdown section the very first time it shows up
      elements.push(
        <motion.div
          key={countdownKey}
          layout
          exit={{ opacity: 0, pointerEvents: "none" as const, transition: { duration: 0 } }}
          transition={{
            layout: { duration: 0.3, ease: "easeInOut" },
            opacity: { duration: 0.3, ease: "easeInOut", delay: 0.3 },
            y: { duration: 0.3, ease: "easeInOut" },
          }}
        >
          {countdownSection()}
        </motion.div>
        ,
        <AnimatedSection key={currentKey} sectionKey={currentKey}>
          {mkSectionView(currentSection, false)}
        </AnimatedSection>,
      )

    } else if (state.intro) {
      elements.push(
        <AnimatedSection key={countdownKey} sectionKey={countdownKey}>
          {countdownSection()}
        </AnimatedSection>,
        <AnimatedSection key={currentKey} sectionKey={currentKey}>
          {mkSectionView(currentSection, false)}
        </AnimatedSection>,
      )

    } else {
      elements.push(
        <AnimatedSection key={currentKey} sectionKey={currentKey}>
          {mkSectionView(currentSection, true)}
        </AnimatedSection>,
      )

      if (isLastSection && !willRepeatDrill) {
        elements.push(
          <AnimatedSection key="all-done" sectionKey="all-done">
            <HighlightedCard isHighlighted={false} minHeight={100}>
              <Flex align="center" justify="center">
                <Text size="9" weight="bold" color="gray">
                  All done!
                </Text>
              </Flex>
            </HighlightedCard>
          </AnimatedSection>,
        )
      } else if (isLastSection && willRepeatWithIntro) {
        const nextCountdownKey = `countdown-${state.drillRepeat + 1}`
        elements.push(
          <AnimatedSection key={nextCountdownKey} sectionKey={nextCountdownKey}>
            <CountdownSection beat={0} beatsPerMeasure={drill.bpm} intro={false} preText={state.bpmIncrease > 0 ? "BPM up!" : "Back to the start!"} />
          </AnimatedSection>,
        )
      } else {
        const nextFlatIndex = (effectiveIdx + 1) % allSections.length
        const next = allSections[nextFlatIndex]
        const nextSection = swapHands ? swapSectionHands(next.section) : next.section
        const nextDrillRepeat = nextFlatIndex === 0 ? state.drillRepeat + 1 : state.drillRepeat
        const nextKey = `section-${nextFlatIndex}-${nextDrillRepeat}`
        elements.push(
          <AnimatedSection key={nextKey} sectionKey={nextKey}>
            {mkSectionView(nextSection, false)}
          </AnimatedSection>,
        )
      }
    }

    return (
      <AnimatePresence mode="popLayout">
        {elements}
      </AnimatePresence>
    )
  }

  return (
    <CenteredContainer>
      {state.playing ? (
        <>
          <Flex align="center" justify="center" wrap="wrap" gap="4">
            <StatusView
              bpm={state.bpm}
              bpmIncrease={state.bpmIncrease}
              drillRepeat={drillRepeat}
              drillRepeatCount={state.drillRepeat}
            />
            <Button onClick={() => setState(NotPlaying)} color="red" size="2">
              Stop
            </Button>
          </Flex>
          {renderSections()}
        </>
      ) : (
        <>
          <DrillControls
            bpm={bpm}
            setBpm={setBpm}
            bpmIncrease={bpmIncrease}
            setBpmIncrease={setBpmIncrease}
            drillRepeat={drillRepeat}
            setDrillRepeat={setDrillRepeat}
            swapHands={swapHands}
            setSwapHands={setSwapHands}
            onStart={handleStart}
          />
          <DrillOverView drill={drill} />
        </>
      )}
    </CenteredContainer>
  )
}
