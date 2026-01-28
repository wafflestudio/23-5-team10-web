import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createPost,
  type CreatePostParams,
} from '@/entities/post/api/createPost'

export function useCreatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreatePostParams) => createPost(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['posts', 'explore'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
