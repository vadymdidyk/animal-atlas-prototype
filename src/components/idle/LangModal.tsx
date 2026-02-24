import type { MouseEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import { useSettings } from '../../hooks/useSettings'
import { useSoundEffect } from '../../hooks/useSoundEffect'

import CloseButton from '../common/CloseButton'

interface LangModalProps {
  isVisible: boolean
  onCloseClick?: () => void
}

const btnClass = "flex justify-center items-center w-full h-full text-center text-[22px] text-white bg-[#5b4dc7]/80 border border-[#7c6bf0]/40 rounded-[10px]"

export default function LangModal({ isVisible, onCloseClick }: LangModalProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'lang_modal' })
  const { lang, handleSetLang } = useSettings()
  const playSelect = useSoundEffect('select')

  const handleCloseClick = (e: MouseEvent) => {
    e.preventDefault()
    playSelect()
    onCloseClick?.()
  }

  const handleLangClick = (e: MouseEvent, language: string) => {
    e.preventDefault()
    if (language === lang) return
    playSelect()
    handleSetLang(language)
    onCloseClick?.()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center py-8 px-7 bg-black/50 backdrop-blur-md z-[4]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "linear", duration: 0.35 }}>
          <CloseButton onClick={handleCloseClick} />

          <div className="w-full max-w-xs">
            <div className="text-lg text-white text-center leading-normal"><p>{t("title")}</p></div>
            <div className="mt-10 space-y-[13px]">
              <div className="w-full h-[60px]">
                <a href="#" onClick={e => handleLangClick(e, 'jp')}
                  className={`${btnClass} ${lang === 'jp' ? 'border-white' : ''}`}>{t("opt01")}</a>
              </div>
              <div className="w-full h-[60px]">
                <a href="#" onClick={e => handleLangClick(e, 'en')}
                  className={`${btnClass} ${lang === 'en' ? 'border-white' : ''}`}>{t("opt02")}</a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
