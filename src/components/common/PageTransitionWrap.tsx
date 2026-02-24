import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageTransitionWrapProps {
  children: ReactNode
}

export default function PageTransitionWrap({ children }: PageTransitionWrapProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "linear" }}
      className="h-full">
      {children}
    </motion.div>
  )
}