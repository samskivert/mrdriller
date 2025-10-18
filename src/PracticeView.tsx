import * as React from "react"
import { Drill } from "./model"
import { drillView } from "./view"
import { MetronomeSounds } from "./MetronomeSounds"

type State = {
  playing: boolean
  section: number
  measure: number
  beat: number
  repeat: number
}

const NotPlaying: State = {
  playing: false,
  section: 0,
  measure: 0,
  beat: 0,
  repeat: 0,
}

export function PracticeView({
  drill,
  onBack,
}: {
  drill: Drill
  onBack: () => void
}) {
  const [bpm, setBpm] = React.useState(60)
  const [state, setState] = React.useState<State>(NotPlaying)

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)
  const soundsRef = React.useRef<MetronomeSounds | null>(null)

  // Initialize metronome sounds
  React.useEffect(() => {
    soundsRef.current = new MetronomeSounds()
    return () => {
      soundsRef.current?.dispose()
    }
  }, [])

  // Calculate quarter note duration in milliseconds (1/4 beat)
  const quarterNoteDuration = (60 * 1000) / bpm / 4

  // Play metronome sound when beat changes
  React.useEffect(() => {
    if (state.playing && soundsRef.current) {
      // Play sound based on current beat (beat 0 = 1st beat, beat 2 = 3rd beat)
      const beatInMeasure = state.beat % 4
      if (beatInMeasure === 0) {
        // Beat 1: higher pitch beep
        soundsRef.current.playBeep()
      } else if (beatInMeasure === 2) {
        // Beat 3: lower pitch boop
        soundsRef.current.playBoop()
      }
    }
  }, [state.playing, state.beat])

  React.useEffect(() => {
    if (state.playing) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          const currentSection = drill.sections[prev.section]

          // Safety check for current section
          if (!currentSection) {
            console.error("Current section is undefined")
            return NotPlaying
          }

          const currentMeasure = currentSection.measures[prev.measure]

          // Safety check for current measure
          if (!currentMeasure) {
            return NotPlaying
          }

          const nextBeat = prev.beat + 1

          // Check if we've finished all beats in current measure
          if (nextBeat >= currentMeasure.length) {
            // Move to next measure or handle section completion
            const nextMeasureIndex = prev.measure + 1
            if (nextMeasureIndex < currentSection.measures.length) {
              // Move to next measure in same section
              return { ...prev, measure: nextMeasureIndex, beat: 0 }
            } else {
              // Finished all measures in section, move to next repeat or next section
              const nextRepeat = prev.repeat + 1
              if (nextRepeat < currentSection.repeat) {
                return { ...prev, repeat: nextRepeat, measure: 0, beat: 0 }
              } else {
                // Move to next section
                const nextSectionIndex = prev.section + 1
                if (nextSectionIndex < drill.sections.length) {
                  return {
                    ...prev,
                    section: nextSectionIndex,
                    measure: 0,
                    beat: 0,
                    repeat: 0,
                  }
                } else {
                  // Finished all sections
                  return NotPlaying
                }
              }
            }
          }
          return { ...prev, beat: nextBeat }
        })
      }, quarterNoteDuration)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state, bpm, drill.sections.length])

  const handleStartStop = () => {
    if (state.playing) {
      setState(NotPlaying)
    } else {
      setState({ playing: true, section: 0, measure: 0, beat: 0, repeat: 0 })
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button
        onClick={onBack}
        style={{
          padding: "8px 16px",
          fontSize: 16,
          cursor: "pointer",
          border: "1px solid #ccc",
          borderRadius: 4,
          backgroundColor: "#f5f5f5",
        }}
      >
        ← Back to Menu
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {drillView(drill, state.playing ? state : undefined)}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px",
          border: "1px solid #ddd",
          borderRadius: 4,
          backgroundColor: "#f9f9f9",
        }}
      >
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          BPM:
          <input
            type="number"
            value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value) || 60)}
            min="30"
            max="200"
            style={{
              width: 60,
              padding: "4px 8px",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
        </label>

        <button
          onClick={handleStartStop}
          style={{
            padding: "8px 16px",
            fontSize: 16,
            cursor: "pointer",
            border: "1px solid #ccc",
            borderRadius: 4,
            backgroundColor: state.playing ? "#ff6b6b" : "#4ecdc4",
            color: "white",
            fontWeight: 600,
          }}
        >
          {state.playing ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  )
}
