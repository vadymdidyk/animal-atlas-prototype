import { appConfig } from '../config/app.config'

interface FormattedTime {
  hours: number
  minutes: number
  seconds: number
}

/*
  Formats unix timestamp to hours:minutes:seconds
*/
export const formatTime = (timestamp: number): FormattedTime => {
  const formattedTime: FormattedTime = {
    hours: Math.floor((timestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((timestamp % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timestamp % (1000 * 60)) / 1000)
  }

  return formattedTime
}

/*
  Adds a leading zero if a number is less than 10
*/
export const padNumber = (num: number | null | undefined): string => {
  if (num && !isNaN(num)) {
    return num < 10 ? `0${num}` : `${num}`
  }
  else {
    return `00`
  }
}

/*
  Converts minutes to seconds
*/
export const minToSec = (val: number): number => {
  return val * 60
}

export const minToMs = (val: number): number => {
  return val * 60 * 1000
}

export const map = (num: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
}

export const round = (n: number) => Math.round(n * 100) / 100

const SESSION_TTL_MS = appConfig.session.TTL_MS

export const getRemainingTtl = (startTime: number): number => {
  const expiresAt = startTime + SESSION_TTL_MS
  const remainingMs = expiresAt - Date.now()
  return Math.max(0, Math.ceil(remainingMs / 1000))
}

export const getTimeLeft = (startTime: number, duration: number): number | undefined => {
  if (!startTime || !duration) return

  const durationInMs = minToMs(duration)
  const timeLeft = (startTime + durationInMs) - Date.now()

  return timeLeft
}