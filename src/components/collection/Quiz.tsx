import type { MouseEvent } from 'react'
import { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import { useSoundEffect } from '../../hooks/useSoundEffect'

interface QuizProps {
  isVisible: boolean
  answerClicked: boolean
  answerCorrect: string
  answerWrong: string
  hiderSymbol: string
  fromListView: boolean
  onAnswer: () => void
}

const layerClass = "absolute inset-0 flex justify-center items-center transition-opacity duration-500"
const answerLinkClass = "relative w-full h-full flex justify-center items-center text-[22px] text-white bg-[rgba(9,17,44,0.75)] border border-white/40 rounded-[10px] leading-[1.2] select-none transition-[color,background-color,border-color] duration-[350ms]"

const correctAnim = {
  initial: { scale: 1, boxShadow: '0 0 0px rgba(123,107,240,0)' },
  animate: {
    scale: [1, 1.08, 1],
    boxShadow: [
      '0 0 0px rgba(123,107,240,0)',
      '0 0 20px rgba(123,107,240,0.6)',
      '0 0 8px rgba(123,107,240,0.3)',
    ],
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

export default function Quiz({ isVisible, answerClicked, answerCorrect, answerWrong, hiderSymbol, fromListView, onAnswer }: QuizProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'quiz' })
  const [answerOrder] = useState(() => Math.random() > 0.5)
  const isSmaller = answerWrong.length >= 10

  const playSelect = useSoundEffect('select')
  const playSuccess = useSoundEffect('success')

  const sparkles = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.cos((i / 6) * Math.PI * 2) * 60,
      y: Math.sin((i / 6) * Math.PI * 2) * 60,
    })), [])

  const handleAnswerClick = useCallback((e: MouseEvent<HTMLAnchorElement>, isSuccess?: boolean) => {
    e.preventDefault()

    if (isSuccess) {
      playSuccess()
    }
    else {
      playSelect()
    }

    onAnswer()
  }, [playSuccess, playSelect, onAnswer])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="quiz"
          className="mt-[70px]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: fromListView ? 0 : 0.75, ease: "linear" } }}>
          <div className="text-center"><p className="text-xl text-white leading-[1.8] select-none">{hiderSymbol.repeat(answerCorrect.length)}{t("question")}</p></div>
          <div
            className="relative flex justify-center mt-[30px] -mx-2.5 z-[1]"
            style={{ flexDirection: answerOrder ? 'row' : 'row-reverse' }}>
            <motion.div
              className={`relative w-[150px] min-h-[60px] mx-2.5 z-[1] ${answerCorrect.length > 2 ? 'h-[70px]' : ''}`}
              whileTap={{ scale: 1.1 }}
              variants={correctAnim}
              initial="initial"
              animate={answerClicked ? 'animate' : 'initial'}
              style={{ borderRadius: 10 }}>
              <a href="#" onClick={e => handleAnswerClick(e, true)} className={`${answerLinkClass} ${isSmaller ? 'text-base' : ''} ${answerClicked ? 'border-[#7c6bf0]' : ''}`}>
                <span className={`${layerClass} px-[30px] ${answerClicked ? 'opacity-0' : ''}`}>
                  <span>{answerCorrect}</span>
                </span>
                <span className={`${layerClass} rounded-[10px] text-white bg-[#5b4dc7] ${answerClicked ? 'opacity-100' : 'opacity-0'} ${answerCorrect.length > 2 ? 'py-0 px-2.5 pl-[50px]' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#a78bfa" className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>{answerCorrect}</span>
                </span>
              </a>
              {answerClicked && (
                <>
                  {sparkles.map(s => (
                    <motion.span
                      key={s.id}
                      className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#a78bfa] pointer-events-none"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{ x: s.x, y: s.y, opacity: 0, scale: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  ))}
                </>
              )}
            </motion.div>
            <motion.div
              className={`relative w-[150px] min-h-[60px] mx-2.5 z-[1] ${answerWrong.length > 2 ? 'h-[70px]' : ''}`}>
              <a href="#" onClick={e => handleAnswerClick(e)} className={`${answerLinkClass} ${isSmaller ? 'text-base' : ''}`}>
                <span className={`${layerClass} px-[30px] ${answerClicked ? 'opacity-0' : ''}`}>
                  <span>{answerWrong}</span>
                </span>
                <span className={`${layerClass} rounded-[10px] text-white/60 bg-[rgba(9,17,44,0.9)] ${answerClicked ? 'opacity-100' : 'opacity-0'} ${answerWrong.length > 2 ? 'py-0 px-2.5 pl-[50px]' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#f472b6" className="absolute top-1/2 left-2 -translate-y-1/2 pointer-events-none w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>{answerWrong}</span>
                </span>
              </a>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
