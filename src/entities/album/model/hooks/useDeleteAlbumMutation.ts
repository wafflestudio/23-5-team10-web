import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCurrentUserId } from '@/shared/auth/useCurrentUser'
import { deleteAlbum } from '@/entities/album/api/deleteAlbum'

export function useDeleteAlbumMutation() {
  const queryClient = useQueryClient()
  const loggedInUser = useCurrentUserId()

  return useMutation({
    mutationFn: ({ albumId }: { albumId: number }) =>
      deleteAlbum({ albumId, loggedInUser }),
    onSuccess: (_, { albumId }) => {
      queryClient.invalidateQueries({
        queryKey: ['albums', 'user', loggedInUser],
      })
      queryClient.invalidateQueries({
        queryKey: ['album', albumId],
      })
    },
  })
}
