import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import translations from './main.json'
import SettingsService from '../services/SettingsService'
import { appConfig } from '../config/app.config'

const settingsService = new SettingsService()
const storedSettings = settingsService.getSettings()

i18n
  .use(initReactI18next)
  .init({
    debug: false,
    resources: {
      jp: {
        translation: translations.jp
      },
      en: {
        translation: translations.en
      }
    },
    lng: (storedSettings && storedSettings.lang) || appConfig.languages.DEFAULT,
    fallbackLng: appConfig.languages.DEFAULT,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n