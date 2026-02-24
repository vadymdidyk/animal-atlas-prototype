import { configureStore } from '@reduxjs/toolkit'
import sessionReducer from './sessionSlice'
import settingsReducer from './settingsSlice'
import collectionReducer from './collectionSlice'

const store = configureStore({
  reducer: {
    session: sessionReducer,
    settings: settingsReducer,
    collection: collectionReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store