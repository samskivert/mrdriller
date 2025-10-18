import * as React from "react"
import { Drill, Section } from "./model"
import { drillView } from "./view"

export function PracticeView({
  drill,
  onBack,
}: {
  drill: Drill
  onBack: () => void
}) {
  const [bpm, setBpm] = React.useState(60)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentSectionIndex, setCurrentSectionIndex] = React.useState(0)
  const [currentMeasureIndex, setCurrentMeasureIndex] = React.useState(0)
  const [currentBeatIndex, setCurrentBeatIndex] = React.useState(0)
  const [currentRepeat, setCurrentRepeat] = React.useState(0)
  const [highlightedSection, setHighlightedSection] = React.useState<
    number | null
  >(null)
  const [highlightedBeat, setHighlightedBeat] = React.useState<{
    sectionIndex: number
    measureIndex: number
    beatIndex: number
  } | null>(null)

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  // Calculate quarter note duration in milliseconds (1/4 beat)
  const quarterNoteDuration = (60 * 1000) / bpm / 4

  React.useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentBeatIndex((prev) => {
          const currentSection = drill.sections[currentSectionIndex]

          // Safety check for current section
          if (!currentSection) {
            console.error("Current section is undefined")
            setIsPlaying(false)
            return prev
          }

          const currentMeasure = currentSection.measures[currentMeasureIndex]

          // Safety check for current measure
          if (!currentMeasure) {
            console.error("Current measure is undefined", {
              sectionIndex: currentSectionIndex,
              measureIndex: currentMeasureIndex,
              sectionMeasures: currentSection.measures.length,
            })
            setIsPlaying(false)
            return prev
          }

          const nextBeat = prev + 1

          // Check if we've finished all beats in current measure
          if (nextBeat >= currentMeasure.length) {
            // Move to next measure or handle section completion
            const nextMeasureIndex = currentMeasureIndex + 1
            if (nextMeasureIndex < currentSection.measures.length) {
              // Move to next measure in same section
              setCurrentMeasureIndex(nextMeasureIndex)
              return 0
            } else {
              // Finished all measures in section, move to next repeat or next section
              console.log("Finished all measures in section", {
                sectionIndex: currentSectionIndex,
                currentRepeat,
                sectionRepeat: currentSection.repeat,
              })

              const nextRepeat = currentRepeat + 1
              if (nextRepeat < currentSection.repeat) {
                console.log("Moving to next repeat")
                setCurrentRepeat(nextRepeat)
                setCurrentMeasureIndex(0)
                return 0
              } else {
                // Move to next section
                console.log("Moving to next section", {
                  currentSectionIndex,
                  totalSections: drill.sections.length,
                })

                const nextSectionIndex = currentSectionIndex + 1
                if (nextSectionIndex < drill.sections.length) {
                  setCurrentSectionIndex(nextSectionIndex)
                  setCurrentMeasureIndex(0)
                  setCurrentRepeat(0)
                  return 0
                } else {
                  // Finished all sections
                  console.log("Finished all sections")
                  setIsPlaying(false)
                  setHighlightedSection(null)
                  setHighlightedBeat(null)
                  return 0
                }
              }
            }
          }
          return nextBeat
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
  }, [
    isPlaying,
    bpm,
    currentSectionIndex,
    currentMeasureIndex,
    currentRepeat,
    drill.sections.length,
  ])

  // Update highlighting based on current position
  React.useEffect(() => {
    console.log("Highlighting update:", {
      sectionIndex: currentSectionIndex,
      measureIndex: currentMeasureIndex,
      beatIndex: currentBeatIndex,
    })
    setHighlightedSection(currentSectionIndex)
    setHighlightedBeat({
      sectionIndex: currentSectionIndex,
      measureIndex: currentMeasureIndex,
      beatIndex: currentBeatIndex,
    })
  }, [currentSectionIndex, currentMeasureIndex, currentBeatIndex])

  // Clear highlighting when not playing
  React.useEffect(() => {
    if (!isPlaying) {
      setHighlightedSection(null)
      setHighlightedBeat(null)
    }
  }, [isPlaying])

  const handleStartStop = () => {
    if (isPlaying) {
      setIsPlaying(false)
      setCurrentSectionIndex(0)
      setCurrentMeasureIndex(0)
      setCurrentBeatIndex(0)
      setCurrentRepeat(0)
      setHighlightedSection(null)
      setHighlightedBeat(null)
    } else {
      setIsPlaying(true)
      setCurrentSectionIndex(0)
      setCurrentMeasureIndex(0)
      setCurrentBeatIndex(0)
      setCurrentRepeat(0)
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
        {drillView(drill, { highlightedSection, highlightedBeat })}
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
            backgroundColor: isPlaying ? "#ff6b6b" : "#4ecdc4",
            color: "white",
            fontWeight: 600,
          }}
        >
          {isPlaying ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  )
}
