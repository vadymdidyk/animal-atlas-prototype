import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { sessionService } from '../services/SessionService'
import { appConfig } from '../config/app.config'

interface SessionState {
  startTime: number
  duration: number
  timeLeft: number | null
  timeIsUp: boolean | null
  completeNoticeChecked: boolean
  timeNoticeChecked: boolean
  showTimeNotice: boolean
  isModelCached: boolean
}

const storedSession = sessionService.getSessionOptions()

const sessionState: SessionState = {
  startTime: storedSession && storedSession.startTime || 0,
  duration: appConfig.session.DURATION_MINUTES,
  completeNoticeChecked: storedSession && storedSession.completeNoticeChecked || false,
  timeNoticeChecked: storedSession && storedSession.timeNoticeChecked || false,
  timeLeft: null,
  timeIsUp: null,
  showTimeNotice: false,
  isModelCached: false
}

const sessionSlice = createSlice({
  name: 'session',
  initialState: sessionState,
  reducers: {
    setStartTime(state, action: PayloadAction<number>) {
      state.startTime = action.payload;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload;
    },
    setTimeLeft(state, action: PayloadAction<number | null>) {
      state.timeLeft = action.payload;
    },
    setTimeIsUp(state, action: PayloadAction<boolean | null>) {
      state.timeIsUp = action.payload;
    },
    setCompleteNoticeChecked(state, action: PayloadAction<boolean>) {
      state.completeNoticeChecked = action.payload;
    },
    setTimeNoticeChecked(state, action: PayloadAction<boolean>) {
      state.timeNoticeChecked = action.payload;
    },
    setShowTimeNotice(state, action: PayloadAction<boolean>) {
      state.showTimeNotice = action.payload;
    },
    setIsModelCached(state, action: PayloadAction<boolean>) {
      state.isModelCached = action.payload;
    },
  },
})

export const {
  setStartTime,
  setDuration,
  setTimeLeft,
  setTimeIsUp,
  setCompleteNoticeChecked,
  setTimeNoticeChecked,
  setShowTimeNotice,
  setIsModelCached,
} = sessionSlice.actions;

export default sessionSlice.reducer;
