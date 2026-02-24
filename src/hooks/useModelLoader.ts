import { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as cocossd from '@tensorflow-models/coco-ssd'
import { appConfig } from '../config/app.config'

async function loadModel(): Promise<cocossd.ObjectDetection> {
  try {
    const modelName = appConfig.model.NAME
    const localModels = await tf.io.listModels()
    const idbModelUrl = `indexeddb://${modelName}`

    if ('indexedDB' in window) {
      for (const modelUrl of Object.keys(localModels)) {
        if (!modelUrl.includes(modelName)) {
          console.log('Removing unused models')
          await tf.io.removeModel(modelUrl)
        }
      }
    }

    if ('indexedDB' in window && idbModelUrl in localModels) {
      console.log('Loading model from indexedDB')
      return await cocossd.load({ modelUrl: idbModelUrl })
    }
    else {
      console.log('Loading model from server')
      const model = await cocossd.load()

      // Save model locally
      if ('indexedDB' in window) {
        await (model as unknown as { model: tf.GraphModel }).model.save(idbModelUrl)
      }
      return model
    }
  } catch (error) {
    console.error('An error occurred while loading the model:', error)
    throw error
  }
}

export function useModelLoader() {
  const modelRef = useRef<cocossd.ObjectDetection | null>(null)
  const [modelReady, setModelReady] = useState(false)
  const [isModelError, setIsModelError] = useState(false)

  useEffect(() => {
    let cancelled = false

    loadModel()
      .then(model => {
        if (cancelled) {
          model.dispose()
          return
        }
        modelRef.current = model
        console.log('2. Model loaded')
        setModelReady(true)
      })
      .catch(error => {
        setIsModelError(true)
        console.error(error)
      })

    return () => {
      cancelled = true

      setTimeout(() => {
        if (modelRef.current) {
          modelRef.current.dispose()
          modelRef.current = null
          console.log('4. Model disposed')
        }
      }, 1000)
    }
  }, [])

  return { modelRef, modelReady, isModelError }
}
