import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCurrentUserId } from '@/shared/auth/useCurrentUser'
import { toggleFollow } from '../api/toggleFollow'

type UseToggleFollowParams = {
  userId: number
  profileUserId?: number
  invalidateFollowList?: boolean
}

export function useToggleFollow({
  userId,
  profileUserId,
  invalidateFollowList = true,
}: UseToggleFollowParams) {
  const queryClient = useQueryClient()
  const loggedInUser = useCurrentUserId()

  return useMutation({
    mutationFn: () => toggleFollow({ userId, loggedInUser }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile', userId] })
      if (profileUserId && profileUserId !== userId) {
        void queryClient.invalidateQueries({
          queryKey: ['profile', profileUserId],
        })
      }
      if (invalidateFollowList) {
        void queryClient.invalidateQueries({ queryKey: ['followers'] })
        void queryClient.invalidateQueries({ queryKey: ['following'] })
      }
      void queryClient.invalidateQueries({ queryKey: ['search', 'recent'] })
    },
  })
}
