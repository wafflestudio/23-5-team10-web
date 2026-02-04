import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCurrentUserId } from '@/shared/auth/useCurrentUser'
import { updateAlbumTitle } from '@/entities/album/api/updateAlbumTitle'
import type { CreateAlbumRequest } from '@/entities/album/model/types'

export function useUpdateAlbumTitleMutation() {
  const queryClient = useQueryClient()
  const loggedInUser = useCurrentUserId()

  return useMutation({
    mutationFn: ({
      albumId,
      payload,
    }: {
      albumId: number
      payload: CreateAlbumRequest
    }) => updateAlbumTitle({ albumId, payload, loggedInUser }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums', 'my'] })
    },
  })
}
