import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../services/SessionService', () => ({
  default: class {
    getSessionOptions() { return false }
  },
  sessionService: {
    getSessionOptions: () => false,
  },
}))

import sessionReducer, {
  setStartTime,
  setDuration,
  setTimeLeft,
  setTimeIsUp,
  setCompleteNoticeChecked,
  setTimeNoticeChecked,
  setShowTimeNotice,
  setIsModelCached,
} from './sessionSlice'

const initialState = {
  startTime: 0,
  duration: 5,
  timeLeft: null,
  timeIsUp: null,
  completeNoticeChecked: false,
  timeNoticeChecked: false,
  showTimeNotice: false,
  isModelCached: false,
}

describe('sessionSlice', () => {
  let state: ReturnType<typeof sessionReducer>

  beforeEach(() => {
    state = sessionReducer(undefined, { type: '@@INIT' })
  })

  it('has correct initial state', () => {
    expect(state).toEqual(initialState)
  })

  it('setStartTime updates startTime', () => {
    const ts = Date.now()
    state = sessionReducer(state, setStartTime(ts))
    expect(state.startTime).toBe(ts)
  })

  it('setDuration updates duration', () => {
    state = sessionReducer(state, setDuration(10))
    expect(state.duration).toBe(10)
  })

  it('setTimeLeft updates timeLeft', () => {
    state = sessionReducer(state, setTimeLeft(120000))
    expect(state.timeLeft).toBe(120000)
  })

  it('setTimeLeft accepts null', () => {
    state = sessionReducer(state, setTimeLeft(120000))
    state = sessionReducer(state, setTimeLeft(null))
    expect(state.timeLeft).toBeNull()
  })

  it('setTimeIsUp updates timeIsUp', () => {
    state = sessionReducer(state, setTimeIsUp(true))
    expect(state.timeIsUp).toBe(true)
  })

  it('setCompleteNoticeChecked updates completeNoticeChecked', () => {
    state = sessionReducer(state, setCompleteNoticeChecked(true))
    expect(state.completeNoticeChecked).toBe(true)
  })

  it('setTimeNoticeChecked updates timeNoticeChecked', () => {
    state = sessionReducer(state, setTimeNoticeChecked(true))
    expect(state.timeNoticeChecked).toBe(true)
  })

  it('setShowTimeNotice updates showTimeNotice', () => {
    state = sessionReducer(state, setShowTimeNotice(true))
    expect(state.showTimeNotice).toBe(true)
  })

  it('setIsModelCached updates isModelCached', () => {
    state = sessionReducer(state, setIsModelCached(true))
    expect(state.isModelCached).toBe(true)
  })

  it('does not modify state for unknown actions', () => {
    const before = { ...state }
    const after = sessionReducer(state, { type: 'unknown/action' })
    expect(after).toEqual(before)
  })
})
