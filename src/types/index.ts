export interface RegisteredItem {
  name: string
  dateRegistered: number
  quizAnswered: boolean
}

export interface CollectionItem {
  id: string
  creatureID: string
  name: string
  name_jp: string
  image_url: string
}

export type SoundStatus = 'on' | 'off'
