import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
    onError: () => {
      toast.error('북마크 처리에 실패했습니다.')
    },
    meta: {
      postId,
      initiallyBookmarked,
    },
  })
}
