import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RegisteredItem, CollectionItem } from '../types'
import { collectionService } from '../services/CollectionService'

interface CollectionState {
  allItems: CollectionItem[]
  registeredItems: RegisteredItem[]
}

const collectionState: CollectionState = {
  allItems: collectionService.getAllItems(),
  registeredItems: collectionService.getRegisteredItems()
}

const collectionSlice = createSlice({
  name: 'collection',
  initialState: collectionState,
  reducers: {
    setAllItems(state, action: PayloadAction<CollectionItem[]>) {
      state.allItems = action.payload
    },
    setRegisteredItems(state, action: PayloadAction<RegisteredItem[]>) {
      state.registeredItems = action.payload
    },
  },
})

export const {
  setAllItems,
  setRegisteredItems
} = collectionSlice.actions

export default collectionSlice.reducer
