import { useCallback } from 'react'
import { toast } from 'sonner'
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
    const trimmedTitle = editingTitle.trim()
    if (!trimmedTitle || albumId === null) {
      return
    }

    if (trimmedTitle.length > 50) {
      toast.error('앨범 이름은 50자를 초과할 수 없습니다.')
      return
    }

    try {
      await updateAlbumTitleMutation.mutateAsync({
        albumId,
        payload: { title: trimmedTitle },
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
