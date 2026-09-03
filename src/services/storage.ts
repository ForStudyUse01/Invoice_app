import type { Bill } from '../types/invoice'
import type { Profile, Settings } from '../types/profile'
import { defaultSettings, emptyProfile } from '../types/profile'

const KEYS = {
  profile: 'bbg.profile',
  bills: 'bbg.bills',
  settings: 'bbg.settings',
} as const

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export const storage = {
  loadProfile(): Profile {
    return read<Profile>(KEYS.profile, emptyProfile)
  },
  saveProfile(profile: Profile): void {
    write(KEYS.profile, profile)
  },
  clearProfile(): void {
    localStorage.removeItem(KEYS.profile)
  },

  loadBills(): Bill[] {
    return read<Bill[]>(KEYS.bills, [])
  },
  saveBills(bills: Bill[]): void {
    write(KEYS.bills, bills)
  },

  loadSettings(): Settings {
    return { ...defaultSettings, ...read<Partial<Settings>>(KEYS.settings, {}) }
  },
  saveSettings(settings: Settings): void {
    write(KEYS.settings, settings)
  },

  clearAll(): void {
    localStorage.removeItem(KEYS.profile)
    localStorage.removeItem(KEYS.bills)
    localStorage.removeItem(KEYS.settings)
  },

  exportAll(): string {
    const payload = {
      profile: this.loadProfile(),
      bills: this.loadBills(),
      settings: this.loadSettings(),
      exportedAt: new Date().toISOString(),
      version: 1,
    }
    return JSON.stringify(payload, null, 2)
  },

  importAll(json: string): { ok: true } | { ok: false; error: string } {
    let parsed: unknown
    try {
      parsed = JSON.parse(json)
    } catch {
      return { ok: false, error: 'File is not valid JSON.' }
    }
    if (typeof parsed !== 'object' || parsed === null) {
      return { ok: false, error: 'Unexpected file format.' }
    }
    const data = parsed as Record<string, unknown>
    if (data.profile && typeof data.profile === 'object') {
      write(KEYS.profile, data.profile)
    }
    if (Array.isArray(data.bills)) {
      write(KEYS.bills, data.bills)
    }
    if (data.settings && typeof data.settings === 'object') {
      write(KEYS.settings, { ...defaultSettings, ...(data.settings as object) })
    }
    return { ok: true }
  },
}
