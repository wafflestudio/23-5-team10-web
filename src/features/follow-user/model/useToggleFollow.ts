import { useMutation, useQueryClient } from '@tanstack/react-query'
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

  return useMutation({
    mutationFn: () => toggleFollow({ userId }),
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
