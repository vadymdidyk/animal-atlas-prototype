import { useEffect, useRef, memo } from 'react'
import { animate, motion } from 'framer-motion'
import { useSession } from '../../hooks/useSession'
import { map, round, minToMs, getTimeLeft } from '../../utils'

const RADIUS = 14.5
const CIRCUMFERENCE = RADIUS * 2 * Math.PI

interface TimerProps {
  isFinished?: boolean
}

export default memo(function Timer({ isFinished = false }: TimerProps) {
  const { startTime, duration } = useSession()
  const arrowRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    if (!arrowRef.current || !bgRef.current || !startTime || !duration) return

    const initialTimeLeft = getTimeLeft(startTime, duration)

    if (initialTimeLeft != null && initialTimeLeft > 0) {
      const rotateVal = round(map(initialTimeLeft, minToMs(duration), 0, 0, 360))
      const dashOffsetVal = round(map(initialTimeLeft, minToMs(duration), 0, CIRCUMFERENCE, 0))
      animate(arrowRef.current, { rotate: rotateVal }, { duration: 0, ease: "linear" })
      animate(bgRef.current, { strokeDashoffset: dashOffsetVal }, { duration: 0, ease: "linear" })
    }

    const interval = setInterval(() => {
      const timeLeftVal = getTimeLeft(startTime, duration)

      if (!timeLeftVal || timeLeftVal <= 0) {
        clearInterval(interval)
      }
      else {
        const rotateVal = round(map(timeLeftVal, minToMs(duration), 0, 0, 360))
        const dashOffsetVal = round(map(timeLeftVal, minToMs(duration), 0, CIRCUMFERENCE, 0))

        animate(arrowRef.current, { rotate: rotateVal }, { duration: 0.1, ease: "linear" })
        animate(bgRef.current, { strokeDashoffset: dashOffsetVal }, { duration: 0.1, ease: "linear" })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [duration, startTime])

  return (
    <motion.div className="absolute bottom-3 -right-2 w-[73px] overflow-hidden">
      <motion.div
        ref={arrowRef}
        className="absolute top-0 left-0 w-full z-[2]">
        <svg width="73" height="73" viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="timerArrowGrad" x1="36.5" y1="5" x2="36.5" y2="19" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
          <path d="M36.5 5 L40 14 L36.5 19 L33 14 Z" fill="url(#timerArrowGrad)" />
        </svg>
      </motion.div>
      <div
        className="absolute top-1/2 left-1/2 w-[58px] h-[58px] -translate-x-1/2 -translate-y-1/2 z-[1] [&_svg]:w-full [&_svg]:h-full"
        style={isFinished || !startTime ? { display: 'none' } : {}}>
        <motion.svg height="58" width="58" viewBox="0 0 58 58">
          <defs>
            <linearGradient id="timerBgGrad" x1="0" y1="0" x2="58" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5b4dc7" />
              <stop offset="100%" stopColor="#1a1035" />
            </linearGradient>
          </defs>
          <motion.circle
            ref={bgRef}
            r="14.5" cx="29" cy="29"
            fill="transparent"
            stroke="url(#timerBgGrad)"
            className="origin-center -rotate-90"
            style={{ strokeWidth: RADIUS * 2, strokeDasharray: CIRCUMFERENCE }}
          />
        </motion.svg>
      </div>
      <div className="w-full">
        <svg width="73" height="73" viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="timerFaceGrad" x1="10" y1="10" x2="63" y2="63" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3b2677" />
              <stop offset="50%" stopColor="#2d1b69" />
              <stop offset="100%" stopColor="#1a1035" />
            </linearGradient>
            <linearGradient id="timerRingGrad" x1="10" y1="10" x2="63" y2="63" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7c6bf0" />
              <stop offset="100%" stopColor="#3b2677" />
            </linearGradient>
            <clipPath id="timerFaceClip">
              <circle cx="36.5" cy="36.5" r="26" />
            </clipPath>
          </defs>
          <circle cx="36.5" cy="36.5" r="29" fill="url(#timerRingGrad)" />
          <circle cx="36.5" cy="36.5" r="26" fill="url(#timerFaceGrad)" />
          <g clipPath="url(#timerFaceClip)" stroke="#7c6bf0" strokeWidth="0.75" opacity="0.3">
            <line x1="36.5" y1="10.5" x2="36.5" y2="62.5" />
            <line x1="10.5" y1="36.5" x2="62.5" y2="36.5" />
            <line x1="18" y1="18" x2="55" y2="55" />
            <line x1="55" y1="18" x2="18" y2="55" />
          </g>
          <circle cx="36.5" cy="36.5" r="2" fill="#7c6bf0" opacity="0.5" />
        </svg>
      </div>
    </motion.div>
  )
})
