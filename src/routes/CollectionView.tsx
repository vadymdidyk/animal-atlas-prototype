import { Link, useLocation } from 'react-router'
import { useMemo, useState } from 'react'
import { motion } from "framer-motion"
import type { CollectionItem } from '../types'
import { useTranslation } from 'react-i18next'
import { appConfig, collectionDetailPath } from '../config/app.config'
import { useSoundEffect } from '../hooks/useSoundEffect'
import { useCollection } from '../hooks/useCollection'
import { useSession } from '../hooks/useSession'

import MessageOverlay from '../components/common/MessageOverlay'
import IconCup from '../components/icons/IconCup'

const spanClass = "absolute top-1/2 left-1/2 block w-[25px] h-px bg-white -translate-x-1/2 -translate-y-1/2"

const animVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.35, delay: 0.35 } }
}

export default function CollectionView() {
  const { t } = useTranslation('translation', { keyPrefix: 'collection' })
  const { t: tAnimal } = useTranslation('translation')
  const location = useLocation()

  const { allItemsList, registeredItemsList, allItemsRegistered } = useCollection()
  const { completeNoticeChecked, handleSetCompleteNoticeChecked } = useSession()
  const [isNavigatingToDetail, setIsNavigatingToDetail] = useState(false)

  const playSelect = useSoundEffect('select')

  const itemsRenderList = useMemo(() => {
    return registeredItemsList
      .map(registeredItem => allItemsList.find(item => item.name === registeredItem.name))
      .filter((item): item is CollectionItem => !!item)
  }, [registeredItemsList, allItemsList])

  const handleLinkClick = () => {
    setIsNavigatingToDetail(true)
    playSelect()
  }

  return (
    <>
      <motion.div
        exit={isNavigatingToDetail ? { opacity: 0, transition: { duration: 0.35 } } : {}}>
        <div className="w-full px-5 mx-auto">
          <motion.div
            className="fixed top-0 left-5 w-[calc(100%-40px)] h-[70px] flex items-center justify-between py-5 border-b border-white/10 bg-[linear-gradient(90deg,rgba(15,10,30,0)_0%,rgba(15,10,30,0.3)_13%,rgba(15,10,30,0.3)_87.5%,rgba(15,10,30,0)_100%)] backdrop-blur-[10px] z-[1]"
            layoutId="collectionBtn"
            transition={{ layout: { ease: "easeOut", duration: 0.35 } }}>
            <motion.div
              className="w-full flex justify-center items-baseline  text-white select-none"
              initial={animVariants.initial}
              animate={animVariants.animate}>
              <p className="text-lg">{t("head_text")}</p>
              <span className="text-sm ml-2.5">
                <b className="inline-flex items-center text-xl translate-y-0.5 opacity-80">
                  {registeredItemsList.length}  / {allItemsList.length}
                </b>
              </span>
            </motion.div>
            <motion.div
              className="w-[30px] h-[30px]"
              initial={animVariants.initial}
              animate={animVariants.animate}>
              <Link to={appConfig.routes.IDLE} state={{ prevPage: location.pathname }} className="relative block w-full h-full p-[5px]">
                <span className={`${spanClass} rotate-45`}></span>
                <span className={`${spanClass} -rotate-45`}></span>
              </Link>
            </motion.div>
          </motion.div>

          <div>
            <motion.ul
              className="flex flex-col gap-3 mx-auto mt-[100px] max-w-[760px] pb-8"
              initial={animVariants.initial}
              animate={animVariants.animate}>
              {itemsRenderList.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0, transition: { ease: "easeOut", duration: 0.5, delay: 0.25 + (index * 0.15) } }}>
                  <Link
                    to={collectionDetailPath(item.name)}
                    onClick={() => handleLinkClick()}
                    state={{ from: 'listView' }}
                    className="flex items-center gap-4 w-full p-3 bg-[rgba(91,77,199,0.15)] border border-white/10 rounded-2xl">
                    <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-[rgba(91,77,199,0.2)]">
                      <img src={`${import.meta.env.BASE_URL}${item.image_url}`} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="flex-1 text-lg text-white">{tAnimal(`${item.name}.name`)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#a78bfa" className="w-5 h-5 shrink-0 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </motion.div>

      <MessageOverlay
        isVisible={!completeNoticeChecked && allItemsRegistered}
        icon={<IconCup />}
        message={t("complete_text")}
        onClose={() => handleSetCompleteNoticeChecked(true)} />
    </>
  )
}