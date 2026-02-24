import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface LoadingOverlayProps {
  isVisible: boolean
}

const dotTransition = { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const }

export default memo(function CameraLoadingOverlay({ isVisible }: LoadingOverlayProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'camera' })

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="flex justify-center items-center flex-col fixed inset-0 bg-black/85 z-[3]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "linear", duration: 0.5 }}>
          <div className="flex items-center gap-4">
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                className="w-4 h-4 rounded-full bg-[#a78bfa]"
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ ...dotTransition, delay }}
              />
            ))}
          </div>
          <div className="text-xl text-white text-center mt-6"><p>{t("modal_loading")}</p></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})
