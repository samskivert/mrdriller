// Global user settings, persisted to local storage.

import { createSignal, createEffect, on } from "solid-js"

export type Settings = {
  showBouncingDot: boolean
  replayIntroOnBpmIncrease: boolean
}

const DEFAULT_SETTINGS: Settings = {
  showBouncingDot: true,
  replayIntroOnBpmIncrease: true,
}

const STORAGE_KEY = "settings"

function loadSettings(): Settings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
  } catch (_error) {
    console.warn("Failed to load settings")
  }
  return DEFAULT_SETTINGS
}

function saveSettings(current: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch (_error) {
    console.warn("Failed to save settings")
  }
}

const [settings, setSettingsSignal] = createSignal<Settings>(loadSettings())

createEffect(on(settings, (current) => saveSettings(current), { defer: true }))

export { settings }

export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  setSettingsSignal((prev) => ({ ...prev, [key]: value }))
}
