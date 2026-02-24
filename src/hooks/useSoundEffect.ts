import useSound from 'use-sound'
import { useSettings } from './useSettings'

import selectSound from '../assets/audio/select.wav'
import startSound from '../assets/audio/start.wav'
import successSound from '../assets/audio/record.wav'

const sounds = {
  select: selectSound,
  success: successSound,
  start: startSound,
} as const

type SoundName = keyof typeof sounds

export function useSoundEffect(name: SoundName) {
  const { soundStatus } = useSettings()
  const [play] = useSound(sounds[name], { soundEnabled: soundStatus === 'on' })

  return play
}
