import { useCallback, useRef } from 'react'
import { useCreateAlbumMutation } from '@/entities/album/model/hooks/useCreateAlbumMutation'

type UseAlbumAddArgs = {
  newAlbumTitle: string
  onComplete: () => void
  onCancel: () => void
  onError: (title: string) => void
}

export function useAlbumAdd({
  newAlbumTitle,
  onComplete,
  onCancel,
  onError,
}: UseAlbumAddArgs) {
  const createAlbumMutation = useCreateAlbumMutation()
  const isCreatingRef = useRef(false)

  const handleCreate = useCallback(async () => {
    if (
      !newAlbumTitle.trim() ||
      createAlbumMutation.isPending ||
      isCreatingRef.current
    ) {
      return
    }

    isCreatingRef.current = true
    const titleToCreate = newAlbumTitle.trim()

    try {
      await createAlbumMutation.mutateAsync({
        title: titleToCreate,
      })
      onComplete()
    } catch (error) {
      console.error('Failed to create album:', error)
      onError(titleToCreate)
    } finally {
      isCreatingRef.current = false
    }
  }, [newAlbumTitle, createAlbumMutation, onComplete, onError])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        handleCreate()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onCancel()
      }
    },
    [handleCreate, onCancel]
  )

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    []
  )

  return {
    createAlbumMutation,
    handleCreate,
    handleKeyDown,
    handleKeyUp,
  }
}
