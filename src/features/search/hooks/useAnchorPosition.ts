import { useLayoutEffect, useMemo, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'

export function useAnchorPosition(
  anchorRef: RefObject<HTMLElement | null> | undefined,
  enabled: boolean
) {
  const [anchorRightPx, setAnchorRightPx] = useState(0)

  useLayoutEffect(() => {
    const el = anchorRef?.current
    if (!el) return

    const update = () => {
      setAnchorRightPx(el.getBoundingClientRect().right)
    }

    update()

    const ro = new ResizeObserver(update)
    ro.observe(el)

    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, { passive: true })

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update)
    }
  }, [anchorRef, enabled])

  const style = useMemo<CSSProperties>(
    () => ({ left: anchorRightPx }),
    [anchorRightPx]
  )

  return style
}
