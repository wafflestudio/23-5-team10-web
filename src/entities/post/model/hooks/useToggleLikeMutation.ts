import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { likePost, unlikePost } from '@/entities/post/api/toggleLike'

type UseToggleLikeMutationParams = {
  postId: number
  initiallyLiked: boolean
}

export function useToggleLikeMutation({
  postId,
  initiallyLiked,
}: UseToggleLikeMutationParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (nextLiked: boolean) => {
      if (nextLiked) {
        return likePost(postId)
      }

      return unlikePost(postId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['posts', 'explore'] })
      queryClient.invalidateQueries({ queryKey: ['posts', 'bookmarks'] })
    },
    onError: () => {
      toast.error('좋아요 처리에 실패했습니다.')
    },
    meta: {
      postId,
      initiallyLiked,
    },
  })
}
