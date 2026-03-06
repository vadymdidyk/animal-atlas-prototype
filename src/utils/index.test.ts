import { describe, it, expect, vi, afterEach } from 'vitest'
import { minToSec, minToMs, getRemainingTtl, getTimeLeft } from './index'

describe('minToSec', () => {
  it('converts minutes to seconds', () => {
    expect(minToSec(1)).toBe(60)
    expect(minToSec(5)).toBe(300)
    expect(minToSec(0)).toBe(0)
  })
})

describe('minToMs', () => {
  it('converts minutes to milliseconds', () => {
    expect(minToMs(1)).toBe(60_000)
    expect(minToMs(5)).toBe(300_000)
    expect(minToMs(0)).toBe(0)
  })

  it('handles fractional minutes', () => {
    expect(minToMs(0.5)).toBe(30_000)
    expect(minToMs(2.5)).toBe(150_000)
  })
})

describe('getRemainingTtl', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns remaining seconds when session is active', () => {
    const now = Date.now()
    vi.spyOn(Date, 'now').mockReturnValue(now)

    // Started just now — full TTL remaining (5 min = 300s)
    expect(getRemainingTtl(now)).toBe(300)
  })

  it('returns reduced time as session progresses', () => {
    const now = Date.now()
    const startTime = now - 2 * 60 * 1000 // started 2 min ago
    vi.spyOn(Date, 'now').mockReturnValue(now)

    expect(getRemainingTtl(startTime)).toBe(180) // 3 min left
  })

  it('returns 0 when session has expired', () => {
    const now = Date.now()
    const startTime = now - 10 * 60 * 1000 // started 10 min ago
    vi.spyOn(Date, 'now').mockReturnValue(now)

    expect(getRemainingTtl(startTime)).toBe(0)
  })

  it('returns 0 exactly at expiration', () => {
    const now = Date.now()
    const startTime = now - 5 * 60 * 1000 // exactly 5 min ago
    vi.spyOn(Date, 'now').mockReturnValue(now)

    expect(getRemainingTtl(startTime)).toBe(0)
  })
})

describe('getTimeLeft', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns milliseconds remaining in session', () => {
    const now = Date.now()
    const startTime = now - 60_000 // started 1 min ago
    vi.spyOn(Date, 'now').mockReturnValue(now)

    // 5 min duration, 1 min elapsed → 4 min left
    expect(getTimeLeft(startTime, 5)).toBe(4 * 60_000)
  })

  it('returns negative value when time has passed', () => {
    const now = Date.now()
    const startTime = now - 10 * 60_000 // started 10 min ago
    vi.spyOn(Date, 'now').mockReturnValue(now)

    expect(getTimeLeft(startTime, 5)).toBeLessThan(0)
  })

  it('returns undefined when startTime is 0', () => {
    expect(getTimeLeft(0, 5)).toBeUndefined()
  })

  it('returns undefined when duration is 0', () => {
    expect(getTimeLeft(Date.now(), 0)).toBeUndefined()
  })
})
