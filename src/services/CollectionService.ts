import ls from 'localstorage-slim'
import { allItems } from "../data/CollectionData"
import type { RegisteredItem, CollectionItem } from '../types'
import { getRemainingTtl } from '../utils'
import { appConfig } from '../config/app.config'

export default class CollectionService {
  private namespace: string

  constructor() {
    this.namespace = appConfig.storage.COLLECTION_KEY
  }

  getRegisteredItems(): RegisteredItem[] {
    const localData = ls.get<RegisteredItem[]>(this.namespace)

    return localData || []
  }

  getAllItems(): CollectionItem[] {
    return allItems
  }

  saveRegisteredItems(list: RegisteredItem[], startTime: number): void {
    const ttl = getRemainingTtl(startTime)

    if (ttl <= 0) return

    ls.set(this.namespace, list, { ttl })
  }

  removeRegisteredItems(): void {
    ls.remove(this.namespace)
  }
}

export const collectionService = new CollectionService()
