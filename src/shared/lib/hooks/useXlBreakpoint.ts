import { useEffect, useState } from 'react'

const XL_BREAKPOINT = 1279

export function useXlBreakpoint() {
  const [isBelowXl, setIsBelowXl] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(`(max-width: ${XL_BREAKPOINT}px)`).matches
      : false
  )

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${XL_BREAKPOINT}px)`)

    const handler = (e: MediaQueryListEvent) => {
      setIsBelowXl(e.matches)
    }

    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isBelowXl
}
