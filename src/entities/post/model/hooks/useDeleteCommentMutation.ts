import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteComment } from '../../api/deleteComment'

interface Comment {
  id: number
  postId: number
  userId: number
  nickname: string
  profileImageUrl: string
  content: string
  createdAt: string
  updatedAt: string
  parentId: number | null
  likeCount: number
  liked: boolean
  likedUserIds: number[]
}

interface CommentResponse {
  success: boolean
  data: Comment[]
}

export const useDeleteCommentMutation = (postId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(postId, commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] })

      const previousComments = queryClient.getQueryData<CommentResponse>([
        'comments',
        postId,
      ])

      queryClient.setQueryData<CommentResponse>(['comments', postId], (old) => {
        if (!old || !old.data) return old

        return {
          ...old,
          data: old.data.filter((comment) => comment.id !== commentId),
        }
      })

      return { previousComments }
    },
    onError: (
      _err,
      _commentId,
      context: { previousComments?: CommentResponse } | undefined
    ) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', postId], context.previousComments)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })
}
