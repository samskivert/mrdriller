export class MetronomeSounds {
  private audioContext: AudioContext | null = null
  private gainNode: GainNode | null = null

  constructor() {
    this.audioContext = new AudioContext()
    this.gainNode = this.audioContext.createGain()
    this.gainNode.connect(this.audioContext.destination)
  }

  playBeep() {
    this.playSound(800, 0.1)
  }

  playBoop() {
    this.playSound(400, 0.1)
  }

  private playSound(frequency: number, duration: number) {
    if (!this.audioContext || !this.gainNode) return

    const ctx = this.audioContext

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
    this.audioContext?.close()
  }
}
