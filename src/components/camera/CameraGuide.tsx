import { memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Variants } from "framer-motion"
import { useTranslation } from 'react-i18next'

import imgFrame from '../../assets/images/common/frame-white.png'

interface CameraGuideProps {
  isVisible: boolean
  objectDetected: boolean
}

export default memo(function CameraGuide({ isVisible, objectDetected }: CameraGuideProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'camera' })
  const animVariants: Variants = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.5, delay: 1, ease: "linear" }
   },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, delay: 1, ease: "linear" }
    },
  }

  if (!isVisible) return

  return (
    <>
      <div
        className="frame-blink fixed top-[17%] left-1/2 w-[84%] h-[67%] pointer-events-none select-none -translate-x-1/2 z-[3]">
        <motion.div
          variants={animVariants}
          initial="hidden"
          animate="visible">
          <img src={imgFrame} alt="" className="w-full h-full" />
        </motion.div>
      </div>

      <motion.div
        className="fixed left-1/2 top-[5%] max-w-[220px] w-full -translate-x-1/2 z-[2]"
        variants={animVariants}
        initial="hidden"
        animate="visible">
        <AnimatePresence mode="wait">
          {objectDetected ? (
            <motion.div key={1} className="flex justify-center items-center text-center w-full min-h-[30px] py-[5px] rounded-[10px] bg-[#5b4dc7]/80 border border-[#7c6bf0]/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: "linear" }}>
              <p className="block text-[15px] text-white whitespace-pre leading-[1.3]" dangerouslySetInnerHTML={{ __html: t("guide_marker_detected") }}></p>
            </motion.div>
          ) :
            (
              <motion.div key={2} className="flex justify-center items-center text-center w-full min-h-[30px] py-[5px] rounded-[10px] bg-[#5b4dc7]/80 border border-[#7c6bf0]/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: "linear" }}>
                <p className="block text-[15px] text-white whitespace-pre leading-[1.3]" dangerouslySetInnerHTML={{ __html: t("guide_default") }}></p>
              </motion.div>
            )}
        </AnimatePresence>
      </motion.div>
    </>
  )
})