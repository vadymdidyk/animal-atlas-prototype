import type { MouseEvent } from 'react'
import { memo } from 'react'
import { Link } from "react-router"
import { motion } from 'framer-motion'
import { collectionDetailPath } from '../../config/app.config'

interface CameraCaptureButtonProps {
  isVisible: boolean
  itemName: string
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void
}

export default memo(function CameraCaptureButton({ isVisible, itemName, onClick }: CameraCaptureButtonProps) {
  return (
    <div className={`fixed bottom-[6%] left-1/2 w-[100px] -translate-x-1/2 transition-[opacity,visibility] duration-500 select-none z-[3] ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <motion.div whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
        <Link
          to={collectionDetailPath(itemName)}
          onClick={onClick}
          className="relative z-[1] block">
          <motion.div
            className="absolute inset-0 rounded-full bg-[#7c6bf0]/30"
            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
          <svg width="100" height="100" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="btnGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#5b4dc7" />
              </radialGradient>
            </defs>
            <circle cx="65" cy="65" r="62" stroke="#7c6bf0" strokeWidth="1.5" opacity="0.4" />
            <circle cx="65" cy="65" r="50" fill="url(#btnGradient)" fillOpacity="0.9" />
            <circle cx="65" cy="65" r="50" stroke="white" strokeWidth="1" opacity="0.15" />
            <circle cx="65" cy="65" r="20" fill="white" fillOpacity="0.2" />
          </svg>
        </Link>
      </motion.div>
    </div>
  )
})
