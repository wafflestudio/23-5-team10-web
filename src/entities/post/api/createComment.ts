import { instance } from '@/shared/api/ky'

export interface CreateCommentPayload {
  postId: number
  content: string
  parentId?: number
}

export const createComment = async ({
  postId,
  content,
  parentId,
}: CreateCommentPayload) => {
  return await instance
    .post(`posts/${postId}/comments`, {
      json: { content, parentId },
    })
    .json()
}
