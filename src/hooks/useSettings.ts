import { useSelector, useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import i18n from '../i18n'
import type { RootState, AppDispatch } from '../store'
import { setUserId, setIsSoundOn, setLang } from '../store/settingsSlice'
import { settingsService } from '../services/SettingsService'
import type { SoundStatus } from '../types'

export function useSettings() {
  const dispatch = useDispatch<AppDispatch>()

  const userId = useSelector((state: RootState) => state.settings.userId)
  const lang = useSelector((state: RootState) => state.settings.lang)
  const soundStatus = useSelector((state: RootState) => state.settings.soundStatus)
  const startTime = useSelector((state: RootState) => state.session.startTime)

  const handleSetUserId = (id?: string): void => {
    const uuid = uuidv4()
    const newUserId = id || uuid

    dispatch(setUserId(newUserId))
    settingsService.saveSettings({ userId: newUserId }, startTime || Date.now())
  }

  const handleSetLang = (language: string | null): void => {
    dispatch(setLang(language))
    settingsService.saveSettings({ lang: language || undefined }, startTime || Date.now())
    if (language) i18n.changeLanguage(language)
  }

  const handleSetSound = (sound: SoundStatus): void => {
    dispatch(setIsSoundOn(sound))
    settingsService.saveSettings({ soundStatus: sound }, startTime || Date.now())
  }

  const handleRemoveSettings = (): void => {
    settingsService.removeSettings()
    dispatch(setUserId(''))
    dispatch(setIsSoundOn(null))
    dispatch(setLang(null))
  }

  return { userId, lang, soundStatus, handleSetUserId, handleSetLang, handleSetSound, handleRemoveSettings }
}
