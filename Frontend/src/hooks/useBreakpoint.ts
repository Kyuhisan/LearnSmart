import { useState, useEffect } from 'react'

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

const MQ_MOBILE = '(max-width: 639px)'
const MQ_TABLET = '(max-width: 1023px)'

function compute(): Breakpoint {
  if (typeof window === 'undefined') return 'desktop'
  if (window.matchMedia(MQ_MOBILE).matches) return 'mobile'
  if (window.matchMedia(MQ_TABLET).matches) return 'tablet'
  return 'desktop'
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(compute)

  useEffect(() => {
    const mqMobile = window.matchMedia(MQ_MOBILE)
    const mqTablet = window.matchMedia(MQ_TABLET)
    const update = () => setBp(compute())
    mqMobile.addEventListener('change', update)
    mqTablet.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => {
      mqMobile.removeEventListener('change', update)
      mqTablet.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return bp
}
