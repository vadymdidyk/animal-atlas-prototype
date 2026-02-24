import type { ReactNode } from 'react'
import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import CloseButton from './CloseButton'

interface MessageOverlayProps {
  isVisible: boolean
  icon: ReactNode
  message: string
  onClose: () => void
}

export default memo(function MessageOverlay({ isVisible, icon, message, onClose }: MessageOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="flex justify-center items-center flex-col fixed inset-0 bg-black/80 backdrop-blur-md z-[4]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "linear", duration: 0.5 }}>
          <CloseButton onClick={() => onClose()} />
          <div className="w-16 mx-auto">
            {icon}
          </div>
          <div className="text-xl text-white text-center mt-6">
            <p className="whitespace-pre" dangerouslySetInnerHTML={{ __html: message }}></p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})
