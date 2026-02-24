import { describe, it, expect, vi, beforeEach } from 'vitest'
import ls from 'localstorage-slim'
import SettingsService from './SettingsService'
import { getRemainingTtl } from '../utils'

vi.mock('localstorage-slim', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}))

vi.mock('../utils', () => ({
  getRemainingTtl: vi.fn(),
}))


const NAMESPACE = 'aa-v1-settings'

const mockSettings = {
  userId: 'user-1',
  lang: 'jp',
  soundStatus: 'on' as const,
}

describe('SettingsService', () => {
  let service: SettingsService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new SettingsService()
  })

  describe('getSettings', () => {
    it('returns settings when data exists in storage', () => {
      vi.mocked(ls.get).mockReturnValue(mockSettings)

      const result = service.getSettings()

      expect(ls.get).toHaveBeenCalledWith(NAMESPACE)
      expect(result).toEqual(mockSettings)
    })

    it('returns false when no data in storage', () => {
      vi.mocked(ls.get).mockReturnValue(null)

      expect(service.getSettings()).toBe(false)
    })
  })

  describe('saveSettings', () => {
    it('saves new data when no existing data', () => {
      vi.mocked(ls.get).mockReturnValue(null)
      vi.mocked(getRemainingTtl).mockReturnValue(200)

      const opts = { userId: 'user-2', lang: 'en' }
      service.saveSettings(opts, 1000)

      expect(ls.set).toHaveBeenCalledWith(NAMESPACE, opts, { ttl: 200 })
    })

    it('merges with existing data', () => {
      vi.mocked(ls.get).mockReturnValue(mockSettings)
      vi.mocked(getRemainingTtl).mockReturnValue(100)

      service.saveSettings({ lang: 'en' }, 1000)

      expect(ls.set).toHaveBeenCalledWith(
        NAMESPACE,
        { ...mockSettings, lang: 'en' },
        { ttl: 100 },
      )
    })

    it('does not save when TTL is 0', () => {
      vi.mocked(getRemainingTtl).mockReturnValue(0)

      service.saveSettings({ lang: 'en' }, 1000)

      expect(ls.set).not.toHaveBeenCalled()
    })

    it('does not save when TTL is negative', () => {
      vi.mocked(getRemainingTtl).mockReturnValue(-5)

      service.saveSettings({ lang: 'en' }, 1000)

      expect(ls.set).not.toHaveBeenCalled()
    })
  })

  describe('removeSettings', () => {
    it('removes data from storage', () => {
      service.removeSettings()

      expect(ls.remove).toHaveBeenCalledWith(NAMESPACE)
    })
  })
})
