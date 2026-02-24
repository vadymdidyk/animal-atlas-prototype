import type { MouseEvent } from 'react'
import { memo } from 'react'

import iconClose from '../../assets/images/common/icon-close.svg'

interface CloseButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
  className?: string
}

export default memo(function CloseButton({ onClick, className = '' }: CloseButtonProps) {
  return (
    <div className="fixed top-5 right-2.5 w-15 h-15 z-[4]">
      <button
        type="button"
        onClick={onClick}
        className={`w-full h-full flex justify-center items-center bg-[rgba(41,47,67,0.5)] border border-white/40 rounded-full ${className}`}>
        <img src={iconClose} alt="" />
      </button>
    </div>
  )
})
