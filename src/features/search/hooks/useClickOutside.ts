import { useEffect } from 'react'
import type { RefObject } from 'react'

type UseClickOutsideOptions = {
  enabled: boolean
  containerRef: RefObject<HTMLElement | null>
  drawerRef: RefObject<HTMLElement | null>
  anchorRef?: RefObject<HTMLElement | null>
  onClickOutside: () => void
}

export function useClickOutside({
  enabled,
  containerRef,
  drawerRef,
  anchorRef,
  onClickOutside,
}: UseClickOutsideOptions) {
  useEffect(() => {
    if (!enabled) return

    const container = containerRef.current
    if (!container) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      const isInsideDrawer = drawerRef.current?.contains(target)
      const isInsideAnchor = anchorRef?.current?.contains(target)

      if (isInsideDrawer || isInsideAnchor) return

      onClickOutside()
    }

    container.addEventListener('pointerdown', handlePointerDown)

    return () => {
      container.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [enabled, containerRef, drawerRef, anchorRef, onClickOutside])
}
