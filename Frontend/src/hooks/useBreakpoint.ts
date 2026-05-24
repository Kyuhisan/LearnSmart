import { useState, useEffect } from 'react'

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

const MQ_TABLET = '(max-width: 1023px)'

function compute(): Breakpoint {
  if (typeof window === 'undefined') return 'desktop'
  if (window.matchMedia(MQ_TABLET).matches) return 'tablet'
  return 'desktop'
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(compute)

  useEffect(() => {
    const mq = window.matchMedia(MQ_TABLET)
    const update = () => setBp(compute())
    mq.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => {
      mq.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return bp
}
