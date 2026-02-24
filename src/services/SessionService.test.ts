import { describe, it, expect, vi, beforeEach } from 'vitest'
import ls from 'localstorage-slim'
import SessionService from './SessionService'
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


const NAMESPACE = 'aa-v1-session'

const mockSession = {
  startTime: 1000,
  duration: 5,
  timeNoticeChecked: false,
  completeNoticeChecked: false,
}

describe('SessionService', () => {
  let service: SessionService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new SessionService()
  })

  describe('getSessionOptions', () => {
    it('returns session options when data exists in storage', () => {
      vi.mocked(ls.get).mockReturnValue(mockSession)

      const result = service.getSessionOptions()

      expect(ls.get).toHaveBeenCalledWith(NAMESPACE)
      expect(result).toEqual(mockSession)
    })

    it('returns false when no data in storage', () => {
      vi.mocked(ls.get).mockReturnValue(null)

      expect(service.getSessionOptions()).toBe(false)
    })
  })

  describe('saveSessionOptions', () => {
    it('saves new data when no existing data', () => {
      vi.mocked(ls.get).mockReturnValue(null)
      vi.mocked(getRemainingTtl).mockReturnValue(200)

      const opts = { startTime: 2000, duration: 5 }
      service.saveSessionOptions(opts, 2000)

      expect(ls.set).toHaveBeenCalledWith(NAMESPACE, opts, { ttl: 200 })
    })

    it('merges with existing data', () => {
      vi.mocked(ls.get).mockReturnValue(mockSession)
      vi.mocked(getRemainingTtl).mockReturnValue(100)

      service.saveSessionOptions({ timeNoticeChecked: true }, 1000)

      expect(ls.set).toHaveBeenCalledWith(
        NAMESPACE,
        { ...mockSession, timeNoticeChecked: true },
        { ttl: 100 },
      )
    })

    it('does not save when TTL is 0', () => {
      vi.mocked(getRemainingTtl).mockReturnValue(0)

      service.saveSessionOptions({ startTime: 2000 }, 2000)

      expect(ls.set).not.toHaveBeenCalled()
    })

    it('does not save when TTL is negative', () => {
      vi.mocked(getRemainingTtl).mockReturnValue(-10)

      service.saveSessionOptions({ startTime: 2000 }, 2000)

      expect(ls.set).not.toHaveBeenCalled()
    })
  })

  describe('removeSessionOptions', () => {
    it('removes data from storage', () => {
      service.removeSessionOptions()

      expect(ls.remove).toHaveBeenCalledWith(NAMESPACE)
    })
  })
})
