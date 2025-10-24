import { Button, Flex, TextField, Text, Box } from "@radix-ui/themes"
import * as React from "react"
import { MetronomeSounds } from "./MetronomeSounds"
import { Drill, Section } from "./model"
import { SectionView } from "./SectionView"

type State = {
  playing: boolean
  beat: number
  row: number
  section: number
  measure: number
  offset: number
  repeat: number
}

const NotPlaying: State = {
  playing: false,
  beat: 0,
  row: 0,
  section: 0,
  measure: 0,
  offset: 0,
  repeat: 0,
}

const Playing = { ...NotPlaying, playing: true }

export function PracticeView({ drill }: { drill: Drill }) {
  const [bpm, setBpm] = React.useState(60)
  const [state, setState] = React.useState<State>(NotPlaying)

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
  const quarterNoteDuration = (60 * 1000) / bpm / drill.bpm

  // Play metronome sound when beat changes
  React.useEffect(() => {
    if (state.playing && soundsRef.current) {
      // Play sound based on current beat (beat 0 = 1st beat, beat 2 = 3rd beat)
      const beatInMeasure = state.beat % drill.bpm
      if (beatInMeasure === 0) {
        // Beat 1: higher pitch beep
        soundsRef.current.playBeep()
      } else if (beatInMeasure === drill.bpm / 2) {
        // Beat 3: lower pitch boop
        soundsRef.current.playBoop()
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
          const nextBeat = prev.beat + 1
          const row = drill.rows[prev.row]
          const section = row[prev.section]
          const measure = section.measures[prev.measure]

          // Check if we've finished all beats in current measure
          const nextOffset = prev.offset + 1
          if (nextOffset < measure.length) {
            return { ...prev, beat: nextBeat, offset: nextOffset }
          }
          // Move to next measure or handle section completion
          const nextMeasure = prev.measure + 1
          if (nextMeasure < section.measures.length) {
            return {
              ...prev,
              beat: nextBeat,
              measure: nextMeasure,
              offset: 0,
            }
          }
          // Finished all measures in section, move to next repeat or next section
          const nextRepeat = prev.repeat + 1
          if (nextRepeat < section.repeat) {
            return {
              ...prev,
              beat: nextBeat,
              repeat: nextRepeat,
              measure: 0,
              offset: 0,
            }
          }
          // Move to next section in the same row
          const nextSection = prev.section + 1
          if (nextSection < row.length) {
            return {
              ...Playing,
              beat: nextBeat,
              row: prev.row,
              section: nextSection,
            }
          }
          // Move to next row
          const nextRow = prev.row + 1
          if (nextRow < drill.rows.length) {
            return {
              ...Playing,
              beat: nextBeat,
              row: nextRow,
            }
          }
          // Finished all rows
          return NotPlaying
        })
      }, quarterNoteDuration)
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
  }, [state, bpm, drill.rows.length])

  const handleStartStop = () => {
    setState(state.playing ? NotPlaying : Playing)
  }

  function mkSectionView(section: Section, rowIndex: number, sectionIndex: number) {
    const isHighlighted = state.playing && state.row === rowIndex && state.section === sectionIndex
    const repeatDisplay =
      isHighlighted && section.repeat > 1
        ? `${state.repeat + 1}/${section.repeat}`
        : section.repeat > 1
          ? `x${section.repeat}`
          : undefined

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
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Flex direction="column" gap="4" style={{ width: "fit-content" }}>
            {drill.rows.flatMap((row, rowIndex) =>
              row.map((section, sectionIndex) => mkSectionView(section, rowIndex, sectionIndex)),
            )}
          </Flex>
        </div>
      </div>

      {/* Controls at bottom - natural height */}
      <div style={{ minHeight: "100px", padding: "16px", borderTop: "1px solid var(--gray-6)" }}>
        <Flex align="center" gap="3">
          <Text size="2" weight="medium">
            BPM:
          </Text>
          <TextField.Root
            type="number"
            value={bpm.toString()}
            onChange={(e) => setBpm(parseInt(e.target.value) || 60)}
            min="30"
            max="200"
            style={{ width: 60 }}
            size="2"
          />

          <Button onClick={handleStartStop} color={state.playing ? "red" : "green"} size="2">
            {state.playing ? "Stop" : "Start"}
          </Button>
        </Flex>
      </div>
    </div>
  )
}
