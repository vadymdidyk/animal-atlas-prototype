import type { MouseEvent, ReactNode } from 'react'

interface AnchorProps {
  children: ReactNode
  target: string
  offset?: number
}

export default function Anchor({ children, target, offset = 0 }: AnchorProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const scrollTargetEl = document.querySelector<HTMLElement>(target)

    if (scrollTargetEl) {
      window.scrollTo({ top: scrollTargetEl.offsetTop - offset, behavior: 'smooth' })
    }
  }

  return (
    <a href={target} onClick={handleClick}>{children}</a>
  )
}
