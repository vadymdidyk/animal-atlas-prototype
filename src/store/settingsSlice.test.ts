import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../services/SettingsService', () => ({
  default: class {
    getSettings() { return false }
  },
  settingsService: {
    getSettings: () => false,
  },
}))

import settingsReducer, {
  setUserId,
  setIsSoundOn,
  setLang,
} from './settingsSlice'

const initialState = {
  userId: '',
  soundStatus: null,
  lang: null,
}

describe('settingsSlice', () => {
  let state: ReturnType<typeof settingsReducer>

  beforeEach(() => {
    state = settingsReducer(undefined, { type: '@@INIT' })
  })

  it('has correct initial state', () => {
    expect(state).toEqual(initialState)
  })

  it('setUserId updates userId', () => {
    state = settingsReducer(state, setUserId('abc-123'))
    expect(state.userId).toBe('abc-123')
  })

  it('setIsSoundOn updates soundStatus', () => {
    state = settingsReducer(state, setIsSoundOn('on'))
    expect(state.soundStatus).toBe('on')

    state = settingsReducer(state, setIsSoundOn('off'))
    expect(state.soundStatus).toBe('off')
  })

  it('setIsSoundOn accepts null', () => {
    state = settingsReducer(state, setIsSoundOn('on'))
    state = settingsReducer(state, setIsSoundOn(null))
    expect(state.soundStatus).toBeNull()
  })

  it('setLang updates lang', () => {
    state = settingsReducer(state, setLang('en'))
    expect(state.lang).toBe('en')

    state = settingsReducer(state, setLang('jp'))
    expect(state.lang).toBe('jp')
  })

  it('setLang accepts null', () => {
    state = settingsReducer(state, setLang('en'))
    state = settingsReducer(state, setLang(null))
    expect(state.lang).toBeNull()
  })

  it('does not modify state for unknown actions', () => {
    const before = { ...state }
    const after = settingsReducer(state, { type: 'unknown/action' })
    expect(after).toEqual(before)
  })
})
