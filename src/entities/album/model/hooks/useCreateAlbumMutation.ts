import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCurrentUserId } from '@/shared/auth/useCurrentUser'
import { createAlbum } from '@/entities/album/api/createAlbum'
import type { CreateAlbumRequest } from '@/entities/album/model/types'

export function useCreateAlbumMutation() {
  const queryClient = useQueryClient()
  const loggedInUser = useCurrentUserId()

  return useMutation({
    mutationFn: (payload: CreateAlbumRequest) =>
      createAlbum({ payload, loggedInUser }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums', 'user'] })
    },
  })
}
