import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    stream: MediaStream | null
  }
}

export function useCameraStream() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoSize, setVideoSize] = useState({ x: 390, y: 844 })
  const [streamReady, setStreamReady] = useState(false)
  const [isStreamError, setIsStreamError] = useState(false)

  // Camera stream setup
  useEffect(() => {
    let currentStream: MediaStream | null = null

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('0. Camera stream available')

      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: { facingMode: "environment" }
        })
        .then(stream => {
          currentStream = stream
          window.stream = stream

          if (!videoRef.current) return
          videoRef.current.srcObject = stream

          return new Promise<void>((resolve) => {
            if (!videoRef.current) return resolve()

            videoRef.current.onloadedmetadata = () => {
              console.log('1. Camera stream loaded')
              setStreamReady(true)
              resolve()
            }
          })
        })
        .catch(error => {
          setIsStreamError(true)
          console.error(error)
        })
    }

    return () => {
      if (currentStream) {
        const tracks = currentStream.getTracks()
        tracks.forEach(track => track.stop())
        currentStream = null
        window.stream = null
      }
    }
  }, [])

  // Resize handler
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect

        setVideoSize({ x: Math.trunc(width), y: Math.trunc(height) })
      }
    })

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return { videoRef, videoSize, streamReady, isStreamError }
}
