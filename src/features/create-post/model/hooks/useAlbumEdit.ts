import { useCallback } from 'react'
import { useUpdateAlbumTitleMutation } from '@/entities/album/model/hooks/useUpdateAlbumTitleMutation'

type UseAlbumEditArgs = {
  albumId: number | null
  editingTitle: string
  onComplete: () => void
}

export function useAlbumEdit({
  albumId,
  editingTitle,
  onComplete,
}: UseAlbumEditArgs) {
  const updateAlbumTitleMutation = useUpdateAlbumTitleMutation()

  const handleUpdate = useCallback(async () => {
    if (!editingTitle.trim() || albumId === null) {
      return
    }

    try {
      await updateAlbumTitleMutation.mutateAsync({
        albumId,
        payload: { title: editingTitle.trim() },
      })
      onComplete()
    } catch (error) {
      console.error('Failed to update album:', error)
    }
  }, [albumId, editingTitle, updateAlbumTitleMutation, onComplete])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, onCancel: () => void) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleUpdate()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
    },
    [handleUpdate]
  )

  return {
    updateAlbumTitleMutation,
    handleUpdate,
    handleKeyDown,
  }
}
