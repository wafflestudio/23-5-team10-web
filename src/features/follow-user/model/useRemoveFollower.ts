import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCurrentUserId } from '@/shared/auth/useCurrentUser'
import { removeFollower } from '../api/removeFollower'

type UseRemoveFollowerParams = {
  onSuccess?: () => void
}

export function useRemoveFollower({ onSuccess }: UseRemoveFollowerParams = {}) {
  const queryClient = useQueryClient()
  const currentUserId = useCurrentUserId()

  return useMutation({
    mutationFn: removeFollower,
    onSuccess: (_, { followerId }) => {
      queryClient.invalidateQueries({
        queryKey: ['followers', currentUserId],
      })
      queryClient.invalidateQueries({
        queryKey: ['profile', currentUserId],
      })
      queryClient.invalidateQueries({
        queryKey: ['following', followerId],
      })
      queryClient.invalidateQueries({
        queryKey: ['profile', followerId],
      })
      onSuccess?.()
    },
  })
}
