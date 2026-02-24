import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { setRegisteredItems } from '../store/collectionSlice'
import { collectionService } from '../services/CollectionService'
import type { RegisteredItem, CollectionItem } from '../types'

export function useCollection() {
  const dispatch = useDispatch<AppDispatch>()

  const allItemsList = useSelector((state: RootState) => state.collection.allItems)
  const registeredItemsList = useSelector((state: RootState) => state.collection.registeredItems)
  const startTime = useSelector((state: RootState) => state.session.startTime)
  const allItemsRegistered = registeredItemsList.length === allItemsList.length

  const addRegisteredItem = (name: string): void => {
    const currentItem: RegisteredItem = {
      name: name,
      dateRegistered: Date.now(),
      quizAnswered: false
    }

    const isCurrentItemInList = registeredItemsList.find(item => item.name === name)

    if (!isCurrentItemInList) {
      const newRegisteredItemsList = [...registeredItemsList, currentItem]
      dispatch(setRegisteredItems(newRegisteredItemsList))
      collectionService.saveRegisteredItems(newRegisteredItemsList, startTime)
    }
  }

  const handleQuizAnswered = (itemName: string): void => {
    const modifiedList = registeredItemsList.map(item => {
      if (item.name === itemName) {
        return { ...item, quizAnswered: true }
      }
      else {
        return item
      }
    })

    dispatch(setRegisteredItems(modifiedList))
    collectionService.saveRegisteredItems(modifiedList, startTime)
  }

  const isItemRegistered = (itemName: string): boolean => {
    return !!registeredItemsList.find(item => item.name === itemName)
  }

  const getItemByName = (name: string): CollectionItem | undefined => {
    const item = allItemsList.find(item => item.name === name.toLowerCase())
    return item
  }

  const handleRemoveItems = (): void => {
    collectionService.removeRegisteredItems()
    dispatch(setRegisteredItems([]))
  }

  const getRegisteredItemIds = (): string[] => {
    const registeredItemIds: string[] = []

    registeredItemsList.forEach(registeredItem => {
      const itemData = allItemsList.find(item => item.name === registeredItem.name)

      if (itemData) {
        registeredItemIds.push(itemData.id)
      }
    })

    return registeredItemIds
  }

  return {
    allItemsList,
    registeredItemsList,
    allItemsRegistered,
    isItemRegistered,
    addRegisteredItem,
    getItemByName,
    handleQuizAnswered,
    handleRemoveItems,
    getRegisteredItemIds
  }
}