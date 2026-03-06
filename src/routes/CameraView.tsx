import type { MouseEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router"
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

import { appConfig, collectionDetailPath } from '../config/app.config'
import { useCollection } from '../hooks/useCollection'
import { useSoundEffect } from '../hooks/useSoundEffect'
import { useSession } from '../hooks/useSession'
import { useModelLoader } from '../hooks/useModelLoader'
import { useCameraStream } from '../hooks/useCameraStream'

import CameraLoadingOverlay from '../components/camera/CameraLoadingOverlay'
import CameraGuide from '../components/camera/CameraGuide'
import MessageOverlay from '../components/common/MessageOverlay'
import CameraLandscapeWarning from '../components/camera/CameraLandscapeWarning'
import CameraCaptureButton from '../components/camera/CameraCaptureButton'
import IconCheck from '../components/icons/IconCheck'
import IconError from '../components/icons/IconError'

import iconClose from '../assets/images/common/icon-close.svg'

export default function CameraView() {
  const navigate = useNavigate()
  const { t } = useTranslation('translation', { keyPrefix: 'camera' })

  const { isModelCached, setIsModelCached } = useSession()
  const { allItemsList, isItemRegistered, addRegisteredItem } = useCollection()
  const { modelRef, modelReady, isModelError } = useModelLoader()
  const { videoRef, videoSize, streamReady, isStreamError } = useCameraStream()
  const hasError = isModelError || isStreamError

  const [registeredItemName, setRegisteredItemName] = useState('')
  const [objectDetected, setObjectDetected] = useState(false)
  const [isLoadOver, setIsLoadOver] = useState(false)
  const [showWarningOverlay, setShowWarningOverlay] = useState(false)

  const playSuccess = useSoundEffect('success')
  const playSelect = useSoundEffect('select')

  // Detection loop
  useEffect(() => {
    if (!modelReady || !streamReady) return

    let detectInterval: ReturnType<typeof setTimeout> | undefined = undefined

    const detect = async () => {
      const net = modelRef.current
      if (!videoRef.current || !net) return

      setIsModelCached(true)
      setIsLoadOver(true)

      const detectedObj = await net.detect(videoRef.current)
      const detectedItem = detectedObj[0] && allItemsList.find(item => item.creatureID === detectedObj[0].class)

      if (detectedItem) {
        setObjectDetected(true)
        setRegisteredItemName(detectedItem.creatureID)
      }
      else {
        setObjectDetected(false)
        // setRegisteredItemName("")
      }

      detectInterval = setTimeout(() => detect(), 1000)
    }

    detect()

    return () => {
      clearTimeout(detectInterval)
    }
  }, [modelReady, streamReady, allItemsList, modelRef, setIsModelCached])

  // Reload page when app goes to background
  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        window.location.reload()
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => document.removeEventListener("visibilitychange", onVisibilityChange)
  }, [])

  // Click handlers
  const handleLinkClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    if (isItemRegistered(registeredItemName)) {
      setShowWarningOverlay(true)
    }
    else {
      addRegisteredItem(registeredItemName)
      playSuccess()
      navigate(collectionDetailPath(registeredItemName))
    }
  }, [registeredItemName, isItemRegistered, addRegisteredItem, playSuccess, navigate])

  return (
    <div className="relative w-full h-full touch-none">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <motion.div
          className="fixed top-5 right-2.5 w-15 h-15 z-[4]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "linear" }}>
          <Link to={appConfig.routes.IDLE} className="w-full h-full flex justify-center items-center bg-[rgba(41,47,67,0.5)] border border-white/40 rounded-full">
            <img src={iconClose} alt="" />
          </Link>
        </motion.div>

        <CameraLoadingOverlay
          isVisible={!isModelCached && !isLoadOver && !hasError} />

        <MessageOverlay
          isVisible={hasError}
          icon={<IconError />}
          message={t("modal_error")}
          onClose={() => navigate(appConfig.routes.IDLE)} />

        <MessageOverlay
          isVisible={showWarningOverlay}
          icon={<IconCheck />}
          message={t("modal_warning_title")}
          onClose={() => { playSelect(); setShowWarningOverlay(false) }} />

        <CameraLandscapeWarning
          title={t("modal_horizontal_title")} />

        <video
          style={{ opacity: (isModelCached || isLoadOver) ? 1 : 0 }}
          id="camera-stream"
          className="block absolute top-1/2 left-1/2 max-w-none min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 z-[1]"
          width={videoSize.x}
          height={videoSize.y}
          ref={videoRef}
          autoPlay={true}
          playsInline={true}
          muted={true}>
        </video>

        <CameraCaptureButton
          isVisible={objectDetected}
          itemName={registeredItemName}
          onClick={handleLinkClick} />

        <CameraGuide
          isVisible={isModelCached || isLoadOver}
          objectDetected={objectDetected} />
      </div>
    </div>
  )
}
