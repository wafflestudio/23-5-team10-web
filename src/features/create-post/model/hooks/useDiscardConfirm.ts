import { useCallback, useState } from 'react'

type UseDiscardConfirmParams = {
  isDirty: boolean
  onClose: () => void
}

export function useDiscardConfirm({
  isDirty,
  onClose,
}: UseDiscardConfirmParams) {
  const [isConfirmOpen, setConfirmOpen] = useState(false)

  const requestClose = useCallback(() => {
    if (isDirty) {
      setConfirmOpen(true)
      return
    }
    onClose()
  }, [isDirty, onClose])

  const handleDialogOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) requestClose()
    },
    [requestClose]
  )

  const closeConfirm = useCallback(() => setConfirmOpen(false), [])

  return {
    isConfirmOpen,
    setConfirmOpen,
    closeConfirm,
    requestClose,
    handleDialogOpenChange,
  }
}
