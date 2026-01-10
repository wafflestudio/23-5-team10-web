import { useCallback, useMemo, useState } from 'react'

type UseImageCarouselResult = {
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
  reset: () => void
  canGoPrev: boolean
  canGoNext: boolean
  goPrev: () => void
  goNext: () => void
  dots: number[]
}

export function useImageCarousel(total: number): UseImageCarouselResult {
  const [rawActiveIndex, setRawActiveIndex] = useState(0)

  const clampIndex = useCallback(
    (index: number) => {
      if (total <= 0) return 0
      return Math.min(Math.max(0, index), total - 1)
    },
    [total]
  )

  const activeIndex = useMemo(
    () => clampIndex(rawActiveIndex),
    [rawActiveIndex, clampIndex]
  )

  const setActiveIndex = useCallback<
    React.Dispatch<React.SetStateAction<number>>
  >(
    (next) => {
      setRawActiveIndex((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next
        return clampIndex(resolved)
      })
    },
    [clampIndex]
  )

  const reset = useCallback(() => setActiveIndex(0), [setActiveIndex])

  const canGoPrev = activeIndex > 0
  const canGoNext = total > 0 && activeIndex < total - 1

  const goPrev = useCallback(() => {
    setActiveIndex((i) => i - 1)
  }, [setActiveIndex])

  const goNext = useCallback(() => {
    setActiveIndex((i) => i + 1)
  }, [setActiveIndex])

  const dots = useMemo(
    () => Array.from({ length: total }, (_, i) => i),
    [total]
  )

  return {
    activeIndex,
    setActiveIndex,
    reset,
    canGoPrev,
    canGoNext,
    goPrev,
    goNext,
    dots,
  }
}
