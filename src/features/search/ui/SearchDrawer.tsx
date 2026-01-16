import { cn } from '@/shared/lib/utils'
import type { CSSProperties, RefObject } from 'react'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Input } from '@/shared/ui/input'
import { useDebounce } from '@/shared/lib/hooks/useDebounce'

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
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

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

  useEffect(() => {
    // TODO: API 연결
    if (debouncedSearchTerm) {
      console.log(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])

  return (
    <>
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-40',
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
            'h-full w-[24rem] rounded-r-2xl bg-white transition-transform duration-300 ease-out',
            open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col gap-6 p-6">
            <h2 className="text-2xl font-bold">검색</h2>
            <Input
              className="rounded-lg border-none bg-gray-100 focus-visible:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색"
            />
            <h3 className="text-md font-semibold">최근 검색 항목</h3>
          </div>
        </aside>
      </div>
    </>
  )
}
