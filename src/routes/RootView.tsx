import { useEffect } from 'react'
import type { MouseEvent } from 'react'
import type { SoundStatus } from '../types'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from 'react-i18next'

import { appConfig } from '../config/app.config'

import { useSettings } from '../hooks/useSettings'
import { useSession } from '../hooks/useSession'
import { useSoundEffect } from '../hooks/useSoundEffect'

import EmojiSlider from '../components/root/EmojiSlider'

const btnClass = "flex justify-center items-center w-full h-full text-center text-white bg-[#5b4dc7]/80 border border-[#7c6bf0]/40"

export default function RootView() {
  const navigate = useNavigate()
  const { t } = useTranslation('translation', {keyPrefix: 'root'})
  const { lang, soundStatus, handleSetLang, handleSetSound } = useSettings()
  const { startTime, handleSetStartTime, handleSetDuration } = useSession()
  const playStart = useSoundEffect('start')

  useEffect(() => {
    if (lang && soundStatus) {
      if (!startTime) {
        handleSetDuration(appConfig.session.DURATION_MINUTES)
        handleSetStartTime(Date.now())
      }
      playStart()
      navigate(appConfig.routes.IDLE)
    }
  }, [lang, soundStatus, navigate])

  const handleLangSelectionClick = (e: MouseEvent<HTMLAnchorElement>, langSelection: string): void => {
    e.preventDefault()
    handleSetLang(langSelection)
  }

  const handleSoundSelectionClick = (e: MouseEvent<HTMLAnchorElement>, soundSelection: SoundStatus): void => {
    e.preventDefault()
    handleSetSound(soundSelection)
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center bg-center bg-cover bg-no-repeat">
      <div className="w-full px-5 mx-auto flex flex-col h-full overflow-hidden">
        <motion.div
          className="w-full mt-8 text-center text-5xl text-white font-[800] tracking-tight font-['Outfit']"
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}>
          Animal Atlas
        </motion.div>

        <motion.div
          className="flex-1 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 2, ease: [0.33, 1, 0.68, 1] }}>
          <EmojiSlider />
        </motion.div>

        <motion.div
          className="pb-15 text-center"
          initial={{ y: 30, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.4, delay: 2, ease: [0.16, 1, 0.3, 1] }}>

          <AnimatePresence initial={false} mode="wait">
            {!lang ? (
              <motion.div
                key={'0'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <div className="text-lg text-white leading-normal"><p>&nbsp;</p></div>
                <div className="mt-10 space-y-[13px]">
                  <div className="w-full h-[60px]">
                    <a href="#" onClick={e => handleLangSelectionClick(e, 'jp')}
                      className={`${btnClass} text-[22px] rounded-[10px]`}>{t("lang_opt01")}</a>
                  </div>
                  <div className="w-full h-[60px]">
                    <a href="#" onClick={e => handleLangSelectionClick(e, 'en')}
                      className={`${btnClass} text-[22px] rounded-[10px]`}>{t("lang_opt02")}</a>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={'1'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                  <div className="text-lg text-white leading-normal"><p>{t("sound")}</p></div>
                <div className="mt-10 space-y-[13px]">
                  <div className="w-full h-[60px]">
                    <a href="#" onClick={e => handleSoundSelectionClick(e, 'on')}
                      className={`${btnClass} text-2xl rounded-[10px]`}>{t("sound_opt01")}</a>
                  </div>
                  <div className="w-full h-[60px]">
                    <a href="#" onClick={e => handleSoundSelectionClick(e, 'off')}
                      className={`${btnClass} text-2xl rounded-[10px]`}>{t("sound_opt02")}</a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div
        className="fixed inset-0 bg-black/[0.99] z-[3] pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.75, delay: 0.1, ease: "linear" }}>
      </motion.div>
    </div>
  )
}