import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  bookmarkPost,
  unbookmarkPost,
} from '@/entities/post/api/toggleBookmark'

type UseToggleBookmarkMutationParams = {
  postId: number
  initiallyBookmarked: boolean
}

export function useToggleBookmarkMutation({
  postId,
  initiallyBookmarked,
}: UseToggleBookmarkMutationParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (nextBookmarked: boolean) => {
      if (nextBookmarked) {
        return bookmarkPost(postId)
      }

      return unbookmarkPost(postId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'bookmarks'] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['posts', 'explore'] })
    },
    meta: {
      postId,
      initiallyBookmarked,
    },
  })
}
