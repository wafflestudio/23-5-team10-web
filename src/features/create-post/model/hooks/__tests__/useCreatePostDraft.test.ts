import { renderHook, act } from '@testing-library/react'
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'

import { useCreatePostDraft } from '../useCreatePostDraft'

describe('useCreatePostDraft', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('파일 선택 시 maxFiles로 제한하고 초과분(ignoredCount)을 알려준다', () => {
    const onIgnoredCount = vi.fn()

    const { result } = renderHook(() =>
      useCreatePostDraft({ maxFiles: 2, onIgnoredCount })
    )

    const file1 = new File(['a'], 'a.png', { type: 'image/png' })
    const file2 = new File(['b'], 'b.png', { type: 'image/png' })
    const file3 = new File(['c'], 'c.png', { type: 'image/png' })

    act(() => {
      result.current.handleDropFiles([file1, file2, file3])
    })

    expect(result.current.files).toHaveLength(2)
    expect(onIgnoredCount).toHaveBeenCalledWith(1)
    expect(result.current.step).toBe('select')
    expect(result.current.isUploaded).toBe(true)
    expect(result.current.activePreviewUrl).toBe('blob:mock')
  })

  it('draft 초기화시 files/step/carousel index를 모두 리셋한다', () => {
    const { result } = renderHook(() => useCreatePostDraft({ maxFiles: 10 }))

    const file1 = new File(['a'], 'a.png', { type: 'image/png' })
    const file2 = new File(['b'], 'b.png', { type: 'image/png' })

    act(() => {
      result.current.handleDropFiles([file1, file2])
    })

    act(() => {
      result.current.carousel.goNext()
    })

    expect(result.current.carousel.activeIndex).toBe(1)

    act(() => {
      result.current.resetDraft()
    })

    expect(result.current.files).toHaveLength(0)
    expect(result.current.step).toBe('select')
    expect(result.current.isUploaded).toBe(false)
    expect(result.current.carousel.activeIndex).toBe(0)
  })
})
