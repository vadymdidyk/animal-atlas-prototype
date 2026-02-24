import ls from 'localstorage-slim'
import type { SoundStatus } from '../types'
import { getRemainingTtl } from '../utils'
import { appConfig } from '../config/app.config'

interface Settings {
  userId?: string
  lang?: string
  soundStatus?: SoundStatus
}

export default class SettingsService {
  private namespace: string

  constructor() {
    this.namespace = appConfig.storage.SETTINGS_KEY
  }

  getSettings(): Settings | false {
    const localData: Settings | null = ls.get(this.namespace)

    if (localData) {
      const localOptions: Settings = {
        userId: localData.userId,
        lang: localData.lang,
        soundStatus: localData.soundStatus,
      }

      return localOptions
    }
    else {
      return false
    }
  }

  saveSettings(opts: Settings, startTime: number) {
    const localData: Settings | null = ls.get(this.namespace)
    const ttl = getRemainingTtl(startTime)

    if (ttl <= 0) return

    const data = localData ? { ...localData, ...opts } : { ...opts }
    ls.set(this.namespace, data, { ttl })
  }

  removeSettings() {
    ls.remove(this.namespace)
  }
}

export const settingsService = new SettingsService()
