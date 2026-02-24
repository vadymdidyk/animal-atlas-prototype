import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router'
import { appConfig } from '../../config/app.config'

const gradients: Record<string, { bg: string; layers: string[] }> = {
  [appConfig.routes.ROOT]: {
    bg: '#0f0a1e',
    layers: [
      'radial-gradient(ellipse 70% 70% at 50% 45%, #2d1b69 0%, transparent 100%)',
      'radial-gradient(ellipse 50% 40% at 50% 100%, #1a1035 0%, transparent 70%)',
      'radial-gradient(ellipse 40% 30% at 50% 0%, #1a1035 0%, transparent 80%)',
    ],
  },
  [appConfig.routes.IDLE]: {
    bg: '#0f0a1e',
    layers: [
      'radial-gradient(ellipse 80% 60% at 55% 40%, #1a1035 0%, transparent 100%)',
      'radial-gradient(ellipse 60% 50% at 0% 100%, #2d1b69 0%, transparent 70%)',
      'radial-gradient(ellipse 70% 40% at 100% 20%, #1a1035 0%, transparent 80%)',
    ],
  },
  [appConfig.routes.GOAL]: {
    bg: '#0f0a1e',
    layers: [
      'radial-gradient(ellipse 80% 60% at 50% 30%, #1a1035 0%, transparent 100%)',
      'radial-gradient(ellipse 50% 50% at 80% 80%, #2d1b69 0%, transparent 70%)',
      'radial-gradient(ellipse 40% 40% at 20% 60%, #2a1040 0%, transparent 80%)',
    ],
  },
  [appConfig.routes.COLLECTION]: {
    bg: '#0f0a1e',
    layers: [
      'radial-gradient(ellipse 90% 50% at 50% 50%, #1a1035 0%, transparent 100%)',
      'radial-gradient(ellipse 50% 60% at 100% 70%, #2d1b69 0%, transparent 70%)',
      'radial-gradient(ellipse 50% 40% at 0% 30%, #1a1035 0%, transparent 80%)',
    ],
  },
}

const defaultKey = appConfig.routes.IDLE

export default function AnimatedBackground() {
  const { pathname } = useLocation()

  const currentGradient = useMemo(() => {
    if (gradients[pathname]) return gradients[pathname]
    // Match subroutes (/collection/:itemName)
    const match = Object.keys(gradients).find(key => key !== '/' && pathname.startsWith(key))
    return gradients[match || defaultKey]
  }, [pathname])

  return (
    <div className="fixed inset-0 z-[-1]" style={{ backgroundColor: currentGradient.bg }}>
      {currentGradient.layers.map((layer, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          animate={{ backgroundImage: layer }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ backgroundImage: layer }}
        />
      ))}
    </div>
  )
}
