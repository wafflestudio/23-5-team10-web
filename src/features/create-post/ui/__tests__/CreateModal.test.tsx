import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'

import { CreateModal } from '../CreateModal'

function getFileInput() {
  const input = document.querySelector('input[type="file"]')
  if (!input) throw new Error('file input not found')
  return input as HTMLInputElement
}

function getFirstDialogOverlay() {
  const overlay = document.querySelector('[data-slot="dialog-overlay"]')
  if (!overlay) throw new Error('dialog overlay not found')
  return overlay as HTMLElement
}

function clickOutsideToRequestClose() {
  getFirstDialogOverlay()
  fireEvent.pointerDown(document.body)
  fireEvent.pointerUp(document.body)
}

describe('CreateModal', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('업로드 전에는 닫힘 요청 시 confirm 없이 바로 닫힌다', async () => {
    const onOpenChange = vi.fn()
    render(<CreateModal open onOpenChange={onOpenChange} />)
    expect(screen.queryByText('게시물을 삭제하시겠어요?')).toBeNull()
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
    expect(screen.queryByText('게시물을 삭제하시겠어요?')).toBeNull()
  })

  it('업로드 후에는 바깥을 누르면 confirm이 뜨고, 삭제를 누르면 닫힌다', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<CreateModal open={true} onOpenChange={onOpenChange} />)

    const file = new File(['hello'], 'a.png', { type: 'image/png' })
    await user.upload(getFileInput(), file)

    clickOutsideToRequestClose()

    expect(onOpenChange).not.toHaveBeenCalled()
    expect(
      await screen.findByText('게시물을 삭제하시겠어요?')
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '취소' }))
    await waitFor(() => {
      expect(screen.queryByText('게시물을 삭제하시겠어요?')).toBeNull()
    })

    clickOutsideToRequestClose()
    await user.click(screen.getByRole('button', { name: '삭제' }))
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
