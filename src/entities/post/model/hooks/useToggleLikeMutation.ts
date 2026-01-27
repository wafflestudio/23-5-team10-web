import { useMutation, useQueryClient } from '@tanstack/react-query'

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
    meta: {
      postId,
      initiallyLiked,
    },
  })
}
