import { describe, it, expect, vi, beforeEach } from 'vitest'
import ls from 'localstorage-slim'
import CollectionService from './CollectionService'
import type { RegisteredItem } from '../types'
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


const NAMESPACE = 'aa-v1-collection'

const mockRegistered: RegisteredItem[] = [
  { name: 'cow', dateRegistered: 1000, quizAnswered: false },
  { name: 'cat', dateRegistered: 2000, quizAnswered: true },
]

describe('CollectionService', () => {
  let service: CollectionService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new CollectionService()
  })

  describe('getAllItems', () => {
    it('returns the static collection data', () => {
      const items = service.getAllItems()

      expect(items).toHaveLength(3)
      expect(items.map(i => i.name)).toEqual(['cow', 'cat', 'dog'])
    })
  })

  describe('getRegisteredItems', () => {
    it('returns registered items from storage', () => {
      vi.mocked(ls.get).mockReturnValue(mockRegistered)

      const result = service.getRegisteredItems()

      expect(ls.get).toHaveBeenCalledWith(NAMESPACE)
      expect(result).toEqual(mockRegistered)
    })

    it('returns empty array when no data in storage', () => {
      vi.mocked(ls.get).mockReturnValue(null)

      expect(service.getRegisteredItems()).toEqual([])
    })
  })

  describe('saveRegisteredItems', () => {
    it('saves items with TTL', () => {
      vi.mocked(getRemainingTtl).mockReturnValue(150)

      service.saveRegisteredItems(mockRegistered, 1000)

      expect(ls.set).toHaveBeenCalledWith(NAMESPACE, mockRegistered, { ttl: 150 })
    })

    it('does not save when TTL is 0', () => {
      vi.mocked(getRemainingTtl).mockReturnValue(0)

      service.saveRegisteredItems(mockRegistered, 1000)

      expect(ls.set).not.toHaveBeenCalled()
    })

    it('does not save when TTL is negative', () => {
      vi.mocked(getRemainingTtl).mockReturnValue(-1)

      service.saveRegisteredItems(mockRegistered, 1000)

      expect(ls.set).not.toHaveBeenCalled()
    })
  })

  describe('removeRegisteredItems', () => {
    it('removes data from storage', () => {
      service.removeRegisteredItems()

      expect(ls.remove).toHaveBeenCalledWith(NAMESPACE)
    })
  })
})
