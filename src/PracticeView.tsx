import { createSignal, createEffect, createMemo, onMount, onCleanup, on, Show } from "solid-js"
import { Flex, Text, Button, Toggle } from "./ui"
import { NumberInput, CenteredContainer, CountdownSection, HighlightedCard } from "./components"
import { MetronomeSounds } from "./MetronomeSounds"
import { Drill, Section, swapSectionHands, computeDrillDuration, MAX_BPM } from "./model"
import { DrillOverView } from "./DrillOverviewView"
import { SectionView } from "./SectionView"
import { computeDrillSizeLevel } from "./sizeConfig"
import { settings } from "./settings"

// A signal that exposes the current width of the browser window.
function useWindowWidth() {
  const [width, setWidth] = createSignal(window.innerWidth)
  onMount(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  })
  return width
}

type State = {
  playing: boolean
  intro: boolean
  beat: number
  row: number
  section: number
  line: number
  measure: number
  offset: number
  repeat: number
  drillRepeat: number
  bpm: number
  bpmIncrease: number
}

const NotPlaying: State = {
  playing: false, intro: false, beat: 0, row: 0, section: 0, line: 0,
  measure: 0, offset: 0, repeat: 0, drillRepeat: 0, bpm: 60, bpmIncrease: 0,
}

const Playing = { ...NotPlaying, playing: true, intro: true }

type DrillConfig = { bpm: number; bpmIncrease: number; drillRepeat: number }

function loadConfig(drillId: string): DrillConfig {
  try {
    const saved = localStorage.getItem(`config.${drillId}`)
    if (saved) return JSON.parse(saved) as DrillConfig
  } catch (_error) {
    console.warn("Failed to load drill config")
  }
  return { bpm: 60, bpmIncrease: 0, drillRepeat: 1 }
}

function saveConfig(drillId: string, config: DrillConfig) {
  try {
    localStorage.setItem(`config.${drillId}`, JSON.stringify(config))
  } catch (_error) {
    console.warn("Failed to save drill config")
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}m ${secs.toString().padStart(2, "0")}s`
}

function DrillControls(props: {
  drill: Drill
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
  const duration = () => formatDuration(
    computeDrillDuration(props.drill, props.bpm, props.bpmIncrease, props.drillRepeat, settings().replayIntroOnBpmIncrease)
  )
  return (
    <Flex align="center" justify="center" wrap="wrap" gap="6">
      <NumberInput label="BPM" value={props.bpm} onChange={props.setBpm} min={30} max={MAX_BPM} width={60} />
      <NumberInput label="BPM Increase" value={props.bpmIncrease} onChange={props.setBpmIncrease} min={0} max={50} width={80} />
      <NumberInput label="Repeat" value={props.drillRepeat} onChange={props.setDrillRepeat} min={1} max={10} width={60} />
      <Text as="label">
        <Flex gap="2" align="center">
          <Toggle size="3" checked={props.swapHands} onCheckedChange={props.setSwapHands} />
          L↔︎R
        </Flex>
      </Text>
      <Text size="4" weight="bold" color="gray" style={{ "min-width": "50px", "text-align": "center" }}>
        {duration()}
      </Text>
      <Button color="green" size="2" onClick={props.onStart}>Start</Button>
    </Flex>
  )
}

function StatusView(props: {
  bpm: number
  bpmIncrease?: number
  drillRepeat?: number
  drillRepeatCount?: number
}) {
  return (
    <Flex align="center" justify="center" gap="4">
      <Text size="7" weight="bold" color="gray">
        {props.bpm} bpm{props.bpmIncrease ? ` (+${props.bpmIncrease})` : ""}
      </Text>
      <Show when={props.drillRepeat && props.drillRepeat > 1 && props.drillRepeatCount !== undefined}>
        <Text size="7" weight="bold" color="gray">
          {(props.drillRepeatCount ?? 0) + 1} / {props.drillRepeat}
        </Text>
      </Show>
    </Flex>
  )
}

export function PracticeView(props: { drill: Drill }) {
  const [bpm, setBpm] = createSignal(60)
  const [bpmIncrease, setBpmIncrease] = createSignal(0)
  const [drillRepeat, setDrillRepeat] = createSignal(1)
  const [swapHands, setSwapHands] = createSignal(false)
  const [state, setState] = createSignal<State>(NotPlaying)

  onMount(() => {
    const config = loadConfig(props.drill.id)
    setBpm(config.bpm)
    setBpmIncrease(config.bpmIncrease)
    setDrillRepeat(config.drillRepeat)
  })

  // save our settings when they change (`defer: true` means don't run the effect _until_ something changes)
  createEffect(
    on(
      [bpm, bpmIncrease, drillRepeat],
      () => saveConfig(props.drill.id, { bpm: bpm(), bpmIncrease: bpmIncrease(), drillRepeat: drillRepeat() }),
      { defer: true },
    ),
  )

  let intervalRef: number | null = null
  let soundsRef: MetronomeSounds | null = null

  onMount(() => {
    soundsRef = new MetronomeSounds()
    onCleanup(() => { soundsRef?.dispose() })
  })

  // Project out the playing and bpm values into separate signals. "Memoizing" means they'll
  // only fire when their value actually changes, not every time state()'s value changes.
  const playing = createMemo(() => state().playing)
  const stateBpm = createMemo(() => state().bpm)

  // Pause the silent audio (used to keep iOS in playback mode) when stopped.
  createEffect(() => { if (!playing()) soundsRef?.pause() })

  // Wake lock: acquire when playing, release via onCleanup (runs before re-run).
  createEffect(() => {
    if (!playing()) return
    if (!("wakeLock" in navigator)) return
    let lock: WakeLockSentinel | null = null
    navigator.wakeLock.request("screen").then((l) => { lock = l }).catch(() => {})
    onCleanup(() => { lock?.release() })
  })

  // Metronome beep on each beat tick. Tracks state() directly, which is fine
  // since we want it to fire on every state change (i.e., every tick).
  createEffect(() => {
    const s = state()
    if (!s.playing || !soundsRef) return
    const beatInMeasure = s.beat % props.drill.bpm
    const beeps = props.drill.beeps
    if (beeps) {
      if (beeps.includes(beatInMeasure + 1)) {
        if (beatInMeasure + 1 === beeps[0]) soundsRef.playBeep()
        else soundsRef.playBoop()
      }
    } else {
      if (beatInMeasure === 0) soundsRef.playBeep()
      else soundsRef.playBoop()
    }
  })

  // Runs the main tick that drives the practice UI.
  createEffect(() => {
    if (!playing()) {
      if (intervalRef) { window.clearInterval(intervalRef); intervalRef = null }
      return
    }
    const delay = (60 * 1000) / stateBpm() / 4 * (props.drill.scale ?? 1)

    intervalRef = window.setInterval(() => {
      setState((prev) => {
        const next = { ...prev, beat: prev.beat + 1 }
        const row = props.drill.rows[prev.row]
        const section = row[prev.section]
        const line = section.lines[prev.line]
        const measure = line.measures[prev.measure]

        if (prev.intro && next.beat < props.drill.bpm * 4) return next
        next.intro = false
        if (next.beat === props.drill.bpm * 4) return next

        next.offset = prev.offset + 1
        if (next.offset < measure.length) return next
        next.offset = 0

        next.measure = prev.measure + 1
        if (next.measure < line.measures.length) return next
        next.measure = 0

        next.line = prev.line + 1
        if (next.line < section.lines.length) return next
        next.line = 0

        next.repeat = prev.repeat + 1
        if (next.repeat < section.repeat) return next
        next.repeat = 0

        next.section = prev.section + 1
        if (next.section < row.length) return next
        next.section = 0

        next.row = prev.row + 1
        if (next.row < props.drill.rows.length) return next
        next.row = 0

        next.drillRepeat = prev.drillRepeat + 1
        if (next.drillRepeat < drillRepeat()) {
          next.bpm = Math.min(MAX_BPM, prev.bpm + prev.bpmIncrease)
          if ((prev.bpmIncrease > 0 && settings().replayIntroOnBpmIncrease) || props.drill.forceIntro) {
            next.beat = 0
            next.intro = true
          }
          return next
        }

        return NotPlaying
      })
    }, delay)

    onCleanup(() => { if (intervalRef) { window.clearInterval(intervalRef); intervalRef = null } })
  })

  let drillJustStarted = false
  const handleStart = () => {
    drillJustStarted = true
    soundsRef?.resume()
    setState({ ...Playing, bpm: bpm(), bpmIncrease: bpmIncrease() })
  }

  const empty = "○"
  function mkRepeat(current: number, total: number) {
    return "●".repeat(current + 1) + empty.repeat(total - current - 1)
  }

  const allSections = props.drill.rows.flatMap((row, rowIndex) =>
    row.map((section, sectionIndex) => ({ section, rowIndex, sectionIndex }))
  )

  const currentFlatIndex = createMemo(() =>
    allSections.findIndex((s) => s.rowIndex === state().row && s.sectionIndex === state().section)
  )
  const idx = createMemo(() => (currentFlatIndex() >= 0 ? currentFlatIndex() : 0))
  // Determine if we will repeat after this drill pass
  const willRepeatDrill = createMemo(() => state().drillRepeat + 1 < drillRepeat())
  // Whether the upcoming repeat should be flagged in the preview slot (a BPM bump or a forced
  // intro). This is independent of whether the intro screen actually plays — even with the
  // "replay intro on BPM increase" setting off, we still want to warn that BPM is about to jump.
  const willAnnounceRepeat = createMemo(
    () => willRepeatDrill() && (state().bpmIncrease > 0 || (props.drill.forceIntro ?? false))
  )
  const isLastSection = createMemo(() => idx() === allSections.length - 1)

  const activeDrill = createMemo(() =>
    swapHands()
      ? { ...props.drill, rows: props.drill.rows.map((row) => row.map(swapSectionHands)) }
      : props.drill
  )

  const windowWidth = useWindowWidth()
  const sizeLevel = createMemo(() => computeDrillSizeLevel(activeDrill(), windowWidth()))

  const currentSection = createMemo(() => {
    const c = allSections[idx()]
    return swapHands() ? swapSectionHands(c.section) : c.section
  })

  function mkSectionView(section: Section, isHighlighted: boolean) {
    const repeatDisplay = isHighlighted
      ? mkRepeat(state().repeat, section.repeat ?? 1)
      : empty.repeat(section.repeat ?? 1)
    return (
      <SectionView
        section={section}
        isHighlighted={isHighlighted}
        repeatDisplay={repeatDisplay}
        highlight={isHighlighted && state().playing && settings().showBouncingDot ? state() : undefined}
        sizeLevel={sizeLevel()}
      />
    )
  }

  function countdownSectionEl() {
    const s = state()
    const isBpmUp = s.drillRepeat > 0 && s.bpmIncrease > 0
    const isRepeat = s.drillRepeat > 0
    return (
      <CountdownSection
        beat={s.beat}
        beatsPerMeasure={props.drill.bpm}
        intro={s.intro}
        preText={isBpmUp ? "BPM up!" : isRepeat ? "Back to the start!" : "Get ready..."}
      />
    )
  }

  // Keys for the two animated display slots (top = current/countdown, bottom = preview).
  // When a key changes, <Presence> + <For> animate the old element out and the new one in.
  const topKey = createMemo(() =>
    state().intro
      ? `countdown-${state().drillRepeat}`
      : `section-${idx()}-${state().drillRepeat}`
  )

  // While the last section before a repeat is playing, the bottom slot flags the repeat itself
  // (BPM up / back to start) rather than previewing the next section as usual.
  const showRepeatPreview = createMemo(() => isLastSection() && willAnnounceRepeat())

  const bottomKey = createMemo(() => {
    if (state().intro) return `section-${idx()}-${state().drillRepeat}-preview`
    if (isLastSection() && !willRepeatDrill()) return "all-done"
    if (showRepeatPreview()) return `countdown-next-${state().drillRepeat + 1}`
    const nextIdx = (idx() + 1) % allSections.length
    const nextDR = nextIdx === 0 ? state().drillRepeat + 1 : state().drillRepeat
    return `section-${nextIdx}-${nextDR}-preview`
  })

  // Beneath the "BPM up" flag, also preview the first section of the repeat itself, so the
  // player can see what's coming right after the jump.
  function firstSectionOfRepeatPreview() {
    const first = allSections[0]
    const section = swapHands() ? swapSectionHands(first.section) : first.section
    return mkSectionView(section, false)
  }

  function topContent() {
    if (state().intro) return countdownSectionEl()
    return mkSectionView(currentSection(), true)
  }

  function bottomContent() {
    const key = bottomKey()
    if (key === "all-done") {
      return (
        <HighlightedCard isHighlighted={false} minHeight={100}>
          <Flex align="center" justify="center">
            <Text size="9" weight="bold" color="gray">All done!</Text>
          </Flex>
        </HighlightedCard>
      )
    }
    if (key.startsWith("countdown-next-")) {
      return (
        <CountdownSection
          beat={0}
          beatsPerMeasure={props.drill.bpm}
          intro={false}
          preText={state().bpmIncrease > 0 ? "BPM up!" : "Back to the start!"}
        />
      )
    }
    const nextIdx = state().intro ? idx() : (idx() + 1) % allSections.length
    const nextItem = allSections[nextIdx]
    const nextSection = swapHands() ? swapSectionHands(nextItem.section) : nextItem.section
    return mkSectionView(nextSection, false)
  }

  // Two persistent DOM slots — always mounted while playing, never recreated on
  // transitions. This means we can measure heights from a stable DOM and animate
  // with imperative WAAPI calls, with no For-loop creation/cleanup race conditions.
  let topSlotRef: HTMLDivElement | undefined
  let bottomSlotRef: HTMLDivElement | undefined
  let storedSlideY = 200

  // Animation effect — created FIRST so SolidJS runs it before the measurement
  // effect below. Reads storedSlideY, which was written by the measurement effect
  // on the *previous* topKey change (i.e. the just-replaced card's height).
  createEffect(on(topKey, (_newKey, oldKey) => {
    const justStarted = drillJustStarted
    drillJustStarted = false
    if (!oldKey || justStarted || !topSlotRef?.isConnected || !bottomSlotRef?.isConnected) return
    topSlotRef.getAnimations().forEach(a => a.cancel())
    bottomSlotRef.getAnimations().forEach(a => a.cancel())
    topSlotRef.animate(
      [{ transform: `translateY(${storedSlideY}px)` }, { transform: "translateY(0)" }],
      { duration: 400, easing: "ease-out", fill: "backwards" }
    )
    bottomSlotRef.animate(
      [{ opacity: "0" }, { opacity: "1" }],
      { duration: 300, easing: "ease-in-out", delay: 400, fill: "backwards" }
    )
  }))

  // Measurement effect — created SECOND so it fires after the animation effect.
  // Stores the now-current top card height for the next transition's animation.
  createEffect(on(topKey, () => {
    if (topSlotRef) storedSlideY = topSlotRef.offsetHeight + 16
  }))

  return (
    <CenteredContainer>
      <Show
        when={state().playing}
        fallback={
          <>
            <DrillControls
              drill={props.drill}
              bpm={bpm()}
              setBpm={setBpm}
              bpmIncrease={bpmIncrease()}
              setBpmIncrease={setBpmIncrease}
              drillRepeat={drillRepeat()}
              setDrillRepeat={setDrillRepeat}
              swapHands={swapHands()}
              setSwapHands={setSwapHands}
              onStart={handleStart}
            />
            <DrillOverView drill={activeDrill()} />
          </>
        }
      >
        <Flex align="center" justify="center" wrap="wrap" gap="4">
          <StatusView
            bpm={state().bpm}
            bpmIncrease={state().bpmIncrease}
            drillRepeat={drillRepeat()}
            drillRepeatCount={state().drillRepeat}
          />
          <Button color="red" size="2" onClick={() => setState(NotPlaying)}>Stop</Button>
        </Flex>
        <Flex direction="column" gap="4">
          <div ref={(r) => (topSlotRef = r)}>{topContent()}</div>
          <div ref={(r) => (bottomSlotRef = r)}>{bottomContent()}</div>
          <Show when={showRepeatPreview()}>
            <div>{firstSectionOfRepeatPreview()}</div>
          </Show>
        </Flex>
      </Show>
    </CenteredContainer>
  )
}
