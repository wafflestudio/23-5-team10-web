import { useMutation, useQueryClient } from '@tanstack/react-query'
import { instance } from '@/shared/api/ky'
import type { PostData } from '@/components/post/PostDetail'

export function useUpdatePostMutation(postId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      content: string
      albumId: number | null
      imageUrls: string[]
    }) => {
      const response = await instance
        .put(`api/v1/posts/${postId}`, { json: payload })
        .json<{ data: PostData; isSuccess: boolean }>()
      return response.data
    },
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['post', postId], updatedData)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
