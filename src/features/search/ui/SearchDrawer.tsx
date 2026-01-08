import { cn } from '@/shared/lib/utils'
import type { CSSProperties, RefObject } from 'react'
import { useLayoutEffect, useMemo, useState } from 'react'

type SearchDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  anchorRef?: RefObject<HTMLElement | null>
}

const DEFAULT_ANCHOR_RIGHT_PX = 0

export function SearchDrawer({
  open,
  onOpenChange,
  anchorRef,
}: SearchDrawerProps) {
  const close = () => onOpenChange(false)
  const [anchorRightPx, setAnchorRightPx] = useState(DEFAULT_ANCHOR_RIGHT_PX)

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
  }, [anchorRef, open])

  const anchoredStyle = useMemo<CSSProperties>(
    () => ({ left: anchorRightPx }),
    [anchorRightPx]
  )

  return (
    <>
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-40 bg-transparent',
          open ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        style={anchoredStyle}
        onClick={close}
      />
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 overflow-hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        style={anchoredStyle}
      >
        <aside
          className={cn(
            'bg-background h-full w-[24rem] border-r transition-transform duration-300 ease-out',
            open ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold">검색</h2>
            <div className="mt-6 h-64 rounded-lg border border-dashed" />
          </div>
        </aside>
      </div>
    </>
  )
}
