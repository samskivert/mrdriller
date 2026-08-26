// This silent-audio trick is an iOS-only workaround (see resume() below) — iPadOS reports as
// "MacIntel" in the UA string, hence the touch-point check to distinguish it from real Macs.
const NEEDS_SILENT_AUDIO_HACK =
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

// Builds a 1-second silent WAV as a blob URL, to be looped by an <audio> element to force iOS's
// "playback" audio session category (bypassing the silent switch, same category as the Music
// app — Web Audio API alone uses "ambient", which iOS mutes in silent mode). Deliberately NOT a
// near-zero-duration clip: an earlier version used a ~0-duration WAV, and looping that restarted
// playback (and refired "canplay") thousands of times per second — a busy-loop that was the
// actual dominant cause of ~180% sustained CPU during playback (confirmed via profiling). A full
// second of silence means looping happens once a second — an imperceptible, negligible-cost pause
// — while still achieving the same iOS session-category effect.
function makeSilentAudioUrl(): string {
  const sampleRate = 8000
  const numSamples = sampleRate // 1 second
  const buffer = new ArrayBuffer(44 + numSamples)
  const view = new DataView(buffer)
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }
  writeString(0, "RIFF")
  view.setUint32(4, 36 + numSamples, true)
  writeString(8, "WAVE")
  writeString(12, "fmt ")
  view.setUint32(16, 16, true) // PCM fmt chunk size
  view.setUint16(20, 1, true) // PCM format
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate, true) // byte rate (1 byte/sample for 8-bit mono)
  view.setUint16(32, 1, true) // block align
  view.setUint16(34, 8, true) // bits per sample
  writeString(36, "data")
  view.setUint32(40, numSamples, true)
  new Uint8Array(buffer, 44).fill(128) // 8-bit unsigned PCM silence sits at the midpoint, 128
  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }))
}

export class MetronomeSounds {
  private audioContext: AudioContext | null = null
  private oscillator: OscillatorNode | null = null
  private envelope: GainNode | null = null
  private silentAudio: HTMLAudioElement | null = null
  private silentAudioUrl: string | null = null

  constructor() {
    // Default ("interactive") latency: this is a drum trainer, so timing precision matters more
    // than the CPU cost of frequent render-thread callbacks (which measurement showed wasn't the
    // actual CPU problem anyway — see makeSilentAudioUrl's comment for what was).
    this.audioContext = new AudioContext()

    // A single oscillator, started once and left running silently (envelope gain 0) for the
    // lifetime of this instance. Each note just pulses the envelope instead of creating a fresh
    // oscillator+gain pair, avoiding the graph-mutation overhead of repeated
    // createOscillator()/start()/stop() calls.
    this.envelope = this.audioContext.createGain()
    this.envelope.gain.value = 0
    this.envelope.connect(this.audioContext.destination)

    this.oscillator = this.audioContext.createOscillator()
    this.oscillator.type = "sine"
    this.oscillator.connect(this.envelope)
    this.oscillator.start()

    // Only needed on platforms with an iOS-style silent switch.
    if (NEEDS_SILENT_AUDIO_HACK) {
      this.silentAudioUrl = makeSilentAudioUrl()
      this.silentAudio = new Audio(this.silentAudioUrl)
      this.silentAudio.loop = true
    }
  }

  playBeep() {
    this.playSound(800, 0.1)
  }

  playBoop() {
    this.playSound(400, 0.1)
  }

  // Must be called from a user gesture (click/touch) handler.
  // Plays a silent <audio> element to upgrade the iOS audio session to "playback"
  // category, which bypasses the silent switch. Also resumes a suspended AudioContext.
  resume() {
    this.silentAudio?.play().catch(() => {})
    this.audioContext?.resume()
  }

  pause() {
    this.silentAudio?.pause()
    // Suspend the context so its audio rendering thread stops doing continuous work (even just
    // producing silence) once nothing needs to play — otherwise it keeps running indefinitely.
    this.audioContext?.suspend()
  }

  private playSound(frequency: number, duration: number) {
    if (!this.audioContext || !this.oscillator || !this.envelope) return

    const ctx = this.audioContext
    if (ctx.state === "suspended") ctx.resume()

    this.oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    // Envelope for smoother sound. Cancel any in-flight ramp from a still-decaying previous
    // note (possible at high BPM) so this note attacks cleanly instead of fighting the old curve.
    const now = ctx.currentTime
    this.envelope.gain.cancelScheduledValues(now)
    this.envelope.gain.setValueAtTime(0, now)
    this.envelope.gain.linearRampToValueAtTime(0.3, now + 0.01)
    this.envelope.gain.exponentialRampToValueAtTime(0.001, now + duration)
    // exponentialRamp can only approach (never reach) 0, so snap the tail to true silence —
    // otherwise a faint constant hum would remain audible between notes.
    this.envelope.gain.setValueAtTime(0, now + duration)
  }

  dispose() {
    this.silentAudio?.pause()
    if (this.silentAudioUrl) URL.revokeObjectURL(this.silentAudioUrl)
    this.oscillator?.stop()
    this.audioContext?.close()
  }
}
