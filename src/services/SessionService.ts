import ls from 'localstorage-slim'
import { getRemainingTtl } from '../utils'
import { appConfig } from '../config/app.config'

interface SessionOptions {
  startTime: number
  duration: number
  timeNoticeChecked: boolean
  completeNoticeChecked: boolean
}

export default class SessionService {
  private namespace: string

  constructor() {
    this.namespace = appConfig.storage.SESSION_KEY
  }

  getSessionOptions(): SessionOptions | false {
    const localData = ls.get<SessionOptions>(this.namespace)

    if (localData) {
      const localOptions: SessionOptions = {
        startTime: localData.startTime,
        duration: localData.duration,
        timeNoticeChecked: localData.timeNoticeChecked,
        completeNoticeChecked: localData.completeNoticeChecked
      }
      return localOptions
    }
    else {
      return false
    }
  }

  saveSessionOptions(opts: Partial<SessionOptions>, startTime: number): void {
    const localData = ls.get<SessionOptions>(this.namespace)
    const ttl = getRemainingTtl(startTime)

    if (ttl <= 0) return

    const data = localData ? { ...localData, ...opts } : { ...opts }
    ls.set(this.namespace, data, { ttl })
  }

  removeSessionOptions(): void {
    ls.remove(this.namespace)
  }

}

export const sessionService = new SessionService()
