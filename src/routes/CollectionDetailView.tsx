import { Link, useLocation, useParams } from 'react-router'
import { useMemo, useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import { appConfig } from '../config/app.config'
import { useCollection } from '../hooks/useCollection'
import { useSettings } from '../hooks/useSettings'
import { useSoundEffect } from '../hooks/useSoundEffect'

import Anchor from '../components/common/Anchor'
import Quiz from '../components/collection/Quiz'

import iconClose from '../assets/images/common/icon-close.svg'
import iconArrow from '../assets/images/common/icon-arrow.svg'

const animDelays = {
  image: 1.1,
  info: 2.75,
}

const floatingBtnClass = "w-full h-full flex justify-center items-center bg-[rgba(41,47,67,0.5)] border border-white/40 rounded-full"

export default function CollectionDetailView() {
  const { itemName: itemId = '' } = useParams()
  const location = useLocation()
  const fromListView = location.state?.from === "listView"

  const { scrollY } = useScroll()
  const { allItemsList, registeredItemsList, handleQuizAnswered } = useCollection()
  const { lang } = useSettings()

  const [answerClicked, setAnswerClicked] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(
    () => (window.innerHeight + window.scrollY) < document.body.scrollHeight
  )

  const { t } = useTranslation('translation', { keyPrefix: itemId })
  const description = t("description")
  const answerCorrect = t("quiz_answer_correct")
  const answerWrong = t("quiz_answer_wrong")

  const playSelect = useSoundEffect('select')

  const currentItem = useMemo(() => {
    return allItemsList.find(item => item.name === itemId.toLowerCase()) ?? null
  }, [itemId, allItemsList])

  const showQuiz = useMemo(() => {
    if (!currentItem) return false

    const currentCaughtAnimal = registeredItemsList.find(item => item.name === currentItem.name)
    return !(currentCaughtAnimal && currentCaughtAnimal.quizAnswered)
  }, [currentItem, registeredItemsList])

  const descriptionHtml = useMemo(() => {
    const hiderSymbol = appConfig.languages.QUIZ_HIDER_SYMBOLS[lang ?? appConfig.languages.DEFAULT]
    return description.replace(answerCorrect, `<span class="quiz-word"><span>${hiderSymbol.repeat(answerCorrect.length)}</span><span>${answerCorrect}</span></span>`)
  }, [description, answerCorrect])

  useMotionValueEvent(scrollY, "change", latest => {
    setShowScrollBtn((window.innerHeight + latest + 10) <= document.body.scrollHeight)
  })

  const handleCloseClick = () => {
    playSelect()

    if (answerClicked && currentItem) {
      handleQuizAnswered(currentItem.name)
    }
  }

  return (
    <div className="min-h-full pt-[30px] pb-[90px] overflow-x-hidden">
      {!fromListView && currentItem?.image_url && (
        <motion.div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[360px] w-[calc(100%-40px)] flex justify-center text-center pointer-events-none z-[1]"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [null, 1, 1, 0],
            transition: { duration: 2, times: [0, 0.2, 0.85, 1], delay: animDelays.image, ease: "linear" },
            transitionEnd: { display: 'none' }
          }}>
          <img src={`${import.meta.env.BASE_URL}${currentItem.image_url}`} alt="" />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { ease: "easeOut", duration: 0.5, delay: fromListView ? 0.25 : animDelays.info } }}>
        <AnimatePresence>
          {(!showQuiz || answerClicked) ? (
            <motion.div
              className="fixed top-5 right-2.5 w-15 h-15 z-[2]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "linear" }}>
              <Link to={fromListView ? appConfig.routes.COLLECTION : appConfig.routes.IDLE} onClick={() => handleCloseClick()} className={`${floatingBtnClass} shadow-[0_0_12px_rgba(91,77,199,0.35)]`}>
                <img src={iconClose} alt="" className="w-[18px] h-[18px] opacity-80" />
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {showQuiz && showScrollBtn && (
            <motion.div
              className="fixed bottom-5 right-2.5 w-15 h-15 z-[2]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "linear", duration: 0.35, delay: 0 }}>
              <Anchor target="#quiz">
                <span className={floatingBtnClass}>
                  <img src={iconArrow} alt="" />
                </span>
              </Anchor>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="container relative h-full">
        <motion.div
          className="flex flex-col justify-center relative text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, transition: { ease: "easeOut", duration: 0.5, delay: fromListView ? 0.25 : animDelays.info } }}>

          {currentItem?.image_url && (
            <figure className="w-full h-[200px] flex justify-center mx-auto rounded-2xl overflow-hidden bg-[rgba(91,77,199,0.15)] border border-white/10 p-3">
              <img src={`${import.meta.env.BASE_URL}${currentItem.image_url}`} alt={currentItem.name_jp} className="w-auto h-full" />
            </figure>
          )}

          <div className="text-center text-[32px] text-white leading-[1.2] whitespace-pre select-none mt-8">
            <p dangerouslySetInnerHTML={{ __html: t("name") }}></p>
          </div>

          <div className={`mt-4 mx-auto max-w-[500px] w-full text-xl text-white leading-[1.8] select-none relative z-[1] p-5 rounded-2xl bg-[rgba(91,77,199,0.1)] border border-white/10 ${!showQuiz || answerClicked ? 'quiz-word-revealed' : ''}`}>
            <p dangerouslySetInnerHTML={{ __html: descriptionHtml }}></p>
          </div>

          <Quiz
            isVisible={showQuiz}
            answerClicked={answerClicked}
            answerCorrect={answerCorrect}
            answerWrong={answerWrong}
            hiderSymbol={appConfig.languages.QUIZ_HIDER_SYMBOLS[lang ?? appConfig.languages.DEFAULT]}
            fromListView={!!fromListView}
            onAnswer={() => setAnswerClicked(true)}
          />
        </motion.div>
      </div>
    </div>
  )
}
