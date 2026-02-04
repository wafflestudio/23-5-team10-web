import { instance } from '@/shared/api/ky'
import {
  PostListItemSchema,
  ApiResponseSchema,
} from '@/entities/post/model/schema'
import type { PostListItem } from '@/entities/post/model/types'

type GetUserPostsParams = {
  userId: number
}

export async function getUserPosts({
  userId,
}: GetUserPostsParams): Promise<PostListItem[]> {
  const response = await instance.get(`api/v1/users/${userId}/posts`)

  const raw = await response.json()

  const parsed = ApiResponseSchema(PostListItemSchema.array()).parse(raw)

  if (!parsed.isSuccess) {
    throw new Error(parsed.message || 'Failed to load user posts')
  }

  return parsed.data
}
