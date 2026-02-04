import { useCallback, useRef } from 'react'
import { useCreateAlbumMutation } from '@/entities/album/model/hooks/useCreateAlbumMutation'
import { useUserAlbumsQuery } from '@/entities/album/model/hooks/useUserAlbumsQuery'
import { useCurrentUserId } from '@/shared/auth/useCurrentUser'
import { toast } from 'sonner'

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
  const currentUserId = useCurrentUserId()
  const createAlbumMutation = useCreateAlbumMutation()

  const { data: albums } = useUserAlbumsQuery({
    userId: currentUserId ?? 0,
    enabled: !!currentUserId,
  })

  const isCreatingRef = useRef(false)

  const handleCreate = useCallback(() => {
    if (isCreatingRef.current || createAlbumMutation.isPending) return
    isCreatingRef.current = true

    const trimmedTitle = newAlbumTitle.trim()
    if (!trimmedTitle) {
      requestAnimationFrame(() => {
        isCreatingRef.current = false
      })
      return
    }

    if (trimmedTitle.length > 50) {
      toast.error('앨범 이름은 50자를 초과할 수 없습니다.')
      onError(trimmedTitle)
      requestAnimationFrame(() => {
        isCreatingRef.current = false
      })
      return
    }

    const isDuplicate = albums?.some(
      (album) => album.title.toLowerCase() === trimmedTitle.toLowerCase()
    )

    if (isDuplicate) {
      toast.error('이미 동일한 이름의 앨범이 존재합니다.')
      onError(trimmedTitle)
      requestAnimationFrame(() => {
        isCreatingRef.current = false
      })
      return
    }

    createAlbumMutation.mutate(
      { title: trimmedTitle },
      {
        onSuccess: () => {
          isCreatingRef.current = false
          onComplete()
        },
        onError: (error) => {
          isCreatingRef.current = false
          toast.error(
            error instanceof Error ? error.message : '앨범 생성에 실패했습니다.'
          )
          onError(trimmedTitle)
        },
      }
    )
  }, [newAlbumTitle, albums, createAlbumMutation, onComplete, onError])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.stopPropagation()
      if (e.key === 'Enter') {
        e.preventDefault()
        handleCreate()
      } else if (e.key === 'Escape') {
        onCancel()
      }
    },
    [handleCreate, onCancel]
  )

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    e.stopPropagation()
  }, [])

  return {
    createAlbumMutation,
    handleCreate,
    handleKeyDown,
    handleKeyUp,
  }
}
