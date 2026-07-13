// Minimal silent WAV (44 bytes): forces iOS to use the "playback" audio session
// category, which bypasses the silent switch (same category as the Music app).
// Web Audio API alone uses "ambient" and gets muted by silent mode.
const SILENT_WAV =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="

export class MetronomeSounds {
  private audioContext: AudioContext | null = null
  private gainNode: GainNode | null = null
  private silentAudio: HTMLAudioElement

  constructor() {
    this.audioContext = new AudioContext()
    this.gainNode = this.audioContext.createGain()
    this.gainNode.connect(this.audioContext.destination)
    this.silentAudio = new Audio(SILENT_WAV)
    this.silentAudio.loop = true
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
    this.silentAudio.play().catch(() => {})
    this.audioContext?.resume()
  }

  pause() {
    this.silentAudio.pause()
  }

  private playSound(frequency: number, duration: number) {
    if (!this.audioContext || !this.gainNode) return

    const ctx = this.audioContext
    if (ctx.state === "suspended") ctx.resume()

    // Note: Oscillators are one-shot in Web Audio API - we must create a new one each time
    const oscillator = ctx.createOscillator()
    const envelope = ctx.createGain()

    oscillator.connect(envelope)
    envelope.connect(this.gainNode)

    oscillator.frequency.value = frequency
    oscillator.type = "sine"

    // Envelope for smoother sound
    const now = ctx.currentTime
    envelope.gain.setValueAtTime(0, now)
    envelope.gain.linearRampToValueAtTime(0.3, now + 0.01)
    envelope.gain.exponentialRampToValueAtTime(0.01, now + duration)

    oscillator.start(now)
    oscillator.stop(now + duration)
  }

  dispose() {
    this.silentAudio.pause()
    this.audioContext?.close()
  }
}
