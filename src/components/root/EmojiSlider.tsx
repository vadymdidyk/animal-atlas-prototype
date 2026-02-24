import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const emojis = ['🐱', '🐶', '🐮', '🐵', '🐰', '🐻', '🐼', '🦊']

export default function EmojiSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % emojis.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-40 h-40 flex justify-center items-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="text-[148px] absolute"
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}>
          {emojis[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
