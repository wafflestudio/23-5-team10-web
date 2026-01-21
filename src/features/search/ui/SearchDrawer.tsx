import { cn } from '@/shared/lib/utils'
import type { CSSProperties, RefObject } from 'react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
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
  const close = useCallback(() => onOpenChange(false), [onOpenChange])
  const [anchorRightPx, setAnchorRightPx] = useState(DEFAULT_ANCHOR_RIGHT_PX)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const drawerRef = useRef<HTMLElement | null>(null)

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
    if (!open) return

    const container = containerRef.current
    if (!container) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      const drawerEl = drawerRef.current
      const anchorEl = anchorRef?.current ?? null

      const isInsideDrawer = drawerEl?.contains(target)
      const isInsideAnchor = anchorEl?.contains(target)

      if (isInsideDrawer || isInsideAnchor) {
        return
      }

      close()
    }

    container.addEventListener('pointerdown', handlePointerDown)

    return () => {
      container.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [anchorRef, close, open])

  useEffect(() => {
    // TODO: API 연결
    if (debouncedSearchTerm) {
      console.log(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          'fixed inset-y-0 right-0 z-40 overflow-hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        style={anchoredStyle}
      >
        <aside
          ref={drawerRef}
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
