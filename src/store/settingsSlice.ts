import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { settingsService } from '../services/SettingsService'
import type { SoundStatus } from '../types'

interface SettingsState {
  userId: string
  soundStatus: SoundStatus | null
  lang: string | null
}

const storedSettings = settingsService.getSettings()

const settingsState: SettingsState = {
  userId: storedSettings && storedSettings.userId || '',
  soundStatus: storedSettings && storedSettings.soundStatus || null,
  lang: storedSettings && storedSettings.lang || null
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: settingsState,
  reducers: {
    setUserId(state, action: PayloadAction<string>) {
      state.userId = action.payload
    },
    setIsSoundOn(state, action: PayloadAction<SoundStatus | null>) {
      state.soundStatus = action.payload
    },
    setLang(state, action: PayloadAction<string | null>) {
      state.lang = action.payload
    },
  },
})

export const {
  setUserId,
  setIsSoundOn,
  setLang
} = settingsSlice.actions

export default settingsSlice.reducer
