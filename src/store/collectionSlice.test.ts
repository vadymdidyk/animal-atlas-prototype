import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { RegisteredItem, CollectionItem } from '../types'

vi.mock('../services/CollectionService', () => ({
  default: class {
    getAllItems() { return [] }
    getRegisteredItems() { return [] }
  },
  collectionService: {
    getAllItems: () => [],
    getRegisteredItems: () => [],
  },
}))

import collectionReducer, {
  setAllItems,
  setRegisteredItems,
} from './collectionSlice'

const initialState = {
  allItems: [] as CollectionItem[],
  registeredItems: [] as RegisteredItem[],
}

const mockItems: CollectionItem[] = [
  { id: '1', creatureID: 'cow', name: 'cow', name_jp: '牛', image_url: 'animals/animal-cow.png' },
  { id: '2', creatureID: 'cat', name: 'cat', name_jp: '猫', image_url: 'animals/animal-cat.png' },
]

const mockRegistered: RegisteredItem[] = [
  { name: 'cow', dateRegistered: 1000000, quizAnswered: false },
]

describe('collectionSlice', () => {
  let state: ReturnType<typeof collectionReducer>

  beforeEach(() => {
    state = collectionReducer(undefined, { type: '@@INIT' })
  })

  it('has correct initial state', () => {
    expect(state).toEqual(initialState)
  })

  it('setAllItems updates allItems', () => {
    state = collectionReducer(state, setAllItems(mockItems))
    expect(state.allItems).toEqual(mockItems)
    expect(state.allItems).toHaveLength(2)
  })

  it('setRegisteredItems updates registeredItems', () => {
    state = collectionReducer(state, setRegisteredItems(mockRegistered))
    expect(state.registeredItems).toEqual(mockRegistered)
    expect(state.registeredItems).toHaveLength(1)
  })

  it('setRegisteredItems can clear items with empty array', () => {
    state = collectionReducer(state, setRegisteredItems(mockRegistered))
    state = collectionReducer(state, setRegisteredItems([]))
    expect(state.registeredItems).toEqual([])
  })

  it('setAllItems replaces all items entirely', () => {
    state = collectionReducer(state, setAllItems(mockItems))
    const singleItem = [mockItems[0]]
    state = collectionReducer(state, setAllItems(singleItem))
    expect(state.allItems).toEqual(singleItem)
    expect(state.allItems).toHaveLength(1)
  })

  it('does not modify state for unknown actions', () => {
    const before = { ...state }
    const after = collectionReducer(state, { type: 'unknown/action' })
    expect(after).toEqual(before)
  })
})
