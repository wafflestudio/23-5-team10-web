import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { useDiscardConfirm } from '../useDiscardConfirm'

describe('useDiscardConfirm', () => {
  it('작성 중 변경사항이 없으면 닫기 요청 시 confirm 없이 바로 닫는다', () => {
    const onClose = vi.fn()
    const { result } = renderHook(() =>
      useDiscardConfirm({ isDirty: false, onClose })
    )

    act(() => {
      result.current.requestClose()
    })

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(result.current.isConfirmOpen).toBe(false)
  })

  it('작성 중 변경사항이 있으면 닫기 요청 시 confirm을 열고 즉시 닫지는 않는다', () => {
    const onClose = vi.fn()
    const { result } = renderHook(() =>
      useDiscardConfirm({ isDirty: true, onClose })
    )

    act(() => {
      result.current.requestClose()
    })

    expect(onClose).not.toHaveBeenCalled()
    expect(result.current.isConfirmOpen).toBe(true)
  })

  it('Dialog의 onOpenChange(false)에서도 동일하게 닫기 정책(confirm/close)이 적용된다', () => {
    const onClose = vi.fn()
    const { result } = renderHook(() =>
      useDiscardConfirm({ isDirty: true, onClose })
    )

    act(() => {
      result.current.handleDialogOpenChange(false)
    })

    expect(onClose).not.toHaveBeenCalled()
    expect(result.current.isConfirmOpen).toBe(true)
  })
})
