import React, { useEffect, useMemo, useState, useCallback } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import useSound from "use-sound"

import { appConfig } from "../config/app.config"
import { useSettings } from "../hooks/useSettings"
import { useSession } from "../hooks/useSession"
import { useSoundEffect } from "../hooks/useSoundEffect"

import Timer from "../components/idle/Timer"
import IconSound from "../components/icons/IconSound"
import IconClock from "../components/icons/IconClock"
import LangModal from "../components/idle/LangModal"
import MessageOverlay from "../components/common/MessageOverlay"

import selectSound from '../assets/audio/select.wav'

export default function IdleView() {
  const navigate = useNavigate()
  const location = useLocation()

  const fromListPage = location.state && location.state.prevPage === appConfig.routes.COLLECTION

  const [nextLocation, setNextLocation] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { t } = useTranslation('translation', {keyPrefix: 'idle'})
  const { t: tWarning } = useTranslation('translation', { keyPrefix: 'warning_modal' })

  const { soundStatus, handleSetSound } = useSettings()
  const { timeNoticeChecked, showTimeNotice, timeIsUp, handleSetTimeNoticeChecked } = useSession()

  const playSelect = useSoundEffect('select')
  const playStart = useSoundEffect('start')
  const [playSelectNoOptions] = useSound(selectSound)

  const fadeAnim = useMemo(() => ({
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { ease: "linear" as const, duration: 0.35, delay: fromListPage ? 0.35 : 0 } },
    exit: { opacity: 0, transition: { duration: 0.25 } }
  }), [fromListPage])

  useEffect(() => {
    if (timeIsUp) {
      navigate(appConfig.routes.GOAL)
    }
  }, [timeIsUp])

  const handleListClick = useCallback(() => {
    setNextLocation(appConfig.routes.COLLECTION)
    playSelect()
  }, [setNextLocation, playSelect])

  const handleSoundBtnClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault()
    if (soundStatus === 'on') {
      handleSetSound('off')
    }
    else {
      handleSetSound('on')
      playSelectNoOptions()
    }
  }, [soundStatus, handleSetSound, playSelectNoOptions])

  const handleLangBtnClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault()
    setIsModalOpen(true)
    playSelect()
  }, [setIsModalOpen, playSelect])

  return (
    <>
      <motion.div
        className="h-full">
        <div className="w-full px-5 mx-auto flex flex-col items-center h-full">

          <div className="flex items-start justify-between w-full mt-8">
            <motion.div
              className="text-5xl text-white font-[800] tracking-tight font-['Outfit']"
              initial={fadeAnim.initial}
              animate={fadeAnim.enter}
              exit={fadeAnim.exit}>
              Animal Atlas
            </motion.div>

            <motion.div
              className="flex items-center gap-2 shrink-0 ml-4"
              initial={fadeAnim.initial}
              animate={fadeAnim.enter}
              exit={fadeAnim.exit}>
              <a href="#" onClick={e => handleLangBtnClick(e)} className="w-9 h-9 flex justify-center items-center border border-white/40 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="18" height="18">
                  <path fillRule="evenodd" d="M9 2.25a.75.75 0 0 1 .75.75v1.506a49.384 49.384 0 0 1 5.343.371.75.75 0 1 1-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 0 1-2.97 6.323c.318.384.65.753 1 1.107a.75.75 0 0 1-1.07 1.052A18.902 18.902 0 0 1 9 13.687a18.823 18.823 0 0 1-5.656 4.482.75.75 0 0 1-.688-1.333 17.323 17.323 0 0 0 5.396-4.353A18.72 18.72 0 0 1 5.89 8.598a.75.75 0 0 1 1.388-.568A17.21 17.21 0 0 0 9 11.224a17.168 17.168 0 0 0 2.391-5.165 48.04 48.04 0 0 0-8.298.307.75.75 0 0 1-.186-1.489 49.159 49.159 0 0 1 5.343-.371V3A.75.75 0 0 1 9 2.25ZM15.75 9a.75.75 0 0 1 .68.433l5.25 11.25a.75.75 0 1 1-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 0 1-1.36-.634l5.25-11.25A.75.75 0 0 1 15.75 9Zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726Z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" onClick={e => handleSoundBtnClick(e)} className="w-9 h-9 flex justify-center items-center border border-white/40 rounded-full">
                <IconSound soundStatus={ soundStatus } />
              </a>
            </motion.div>
          </div>

          <motion.div
            className="flex justify-center items-center flex-1 w-full"
            initial={fadeAnim.initial}
            animate={fadeAnim.enter}
            exit={fadeAnim.exit}>
            <Link to={appConfig.routes.CAMERA} onClick={() => playStart()} className="camera-glow relative flex justify-center items-center w-[220px] h-[220px] text-center z-1">
              {Array.from({ length: 3 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full bg-[#5b4dc7]/10 border border-[#7c6bf0]/30 z-[-2]"
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ ease: "easeOut", duration: 2, delay: i * 0.33, repeat: Infinity, repeatDelay: 2.5 }} />
                ))}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 1)" className="relative w-[45%] h-[45%] mix-blend-soft-light">
                <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>

          <div className="w-full">
            <motion.div
              className="relative w-full h-[70px]"
              layoutId="collectionBtn"
              initial={fromListPage ? {} : { opacity: 0 }}
              animate={fromListPage ? {} : { opacity: 1, transition: { delay: fromListPage ? 0.35 : 0 } }}
              exit={nextLocation === appConfig.routes.COLLECTION ? {} : { opacity: 0, transition: { duration: 0.35 } }}
              transition={{ layout: {ease: "easeOut", duration: 0.35} }}>

              <motion.div
                initial={fadeAnim.initial}
                animate={fadeAnim.enter}
                exit={fadeAnim.exit}>
                <Timer></Timer>
              </motion.div>

              <Link
                onClick={() => handleListClick()}
                to={appConfig.routes.COLLECTION}
                state={{ prevPage: location.pathname }}
                className="flex justify-center items-center w-full h-full text-lg text-white leading-normal bg-[linear-gradient(90deg,rgba(15,10,30,0)_0%,rgba(15,10,30,0.3)_13%,rgba(15,10,30,0.3)_87.5%,rgba(15,10,30,0)_100%)] border-t border-white/10">
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff" width="20" height="20"
                  className="mr-2.5"
                  initial={{ opacity: fromListPage ? 0 : 1 }}
                  animate={{ opacity: 1, transition: { duration: 0.35, delay: fromListPage ? 0.35 : 0 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                </motion.svg>
                <motion.span
                  className="text-white"
                  layoutId="collectionText"
                  initial={{ opacity: fromListPage ? 0 : 1 }}
                  animate={{ opacity: 1, transition: { duration: 0.35, delay: fromListPage ? 0.35 : 0 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}>
                  {t("btn")}
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <LangModal
        isVisible={isModalOpen}
        onCloseClick={() => setIsModalOpen(false)} />

      <MessageOverlay
        isVisible={!timeNoticeChecked && showTimeNotice}
        icon={<IconClock />}
        message={tWarning("text")}
        onClose={() => { playSelect(); handleSetTimeNoticeChecked() }} />
    </>
  )
}
