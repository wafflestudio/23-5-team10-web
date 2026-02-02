import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createComment,
  type CreateCommentPayload,
} from '../../api/createComment'

export const useCreateCommentMutation = (postId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => createComment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId, 'comments'] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    },
  })
}
