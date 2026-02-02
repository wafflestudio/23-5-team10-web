import { instance } from '@/shared/api/ky'

export const deleteComment = async (postId: number, commentId: number) => {
  return await instance
    .delete(`api/v1/posts/${postId}/comments/${commentId}`)
    .json<{ success: boolean }>()
}
