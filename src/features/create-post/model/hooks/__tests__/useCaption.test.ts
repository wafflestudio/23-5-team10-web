import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { useCaption } from '../useCaption'

describe('useCaption', () => {
  it('maxLength를 넘는 입력은 잘라서 저장한다', () => {
    const { result } = renderHook(() => useCaption({ maxLength: 5 }))

    act(() => {
      result.current.setCaption('abcdef')
    })

    expect(result.current.caption).toBe('abcde')
    expect(result.current.captionLength).toBe(5)
    expect(result.current.maxLength).toBe(5)
  })
})
