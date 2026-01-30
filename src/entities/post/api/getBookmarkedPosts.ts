import { instance } from '@/shared/api/ky'
import {
  PostListItemSchema,
  ApiResponseSchema,
} from '@/entities/post/model/schema'
import type { PostListItem } from '@/entities/post/model/types'

export async function getBookmarkedPosts(): Promise<PostListItem[]> {
  const response = await instance.get('api/v1/posts/bookmarks')

  const raw = await response.json()

  const parsed = ApiResponseSchema(PostListItemSchema.array()).parse(raw)

  if (!parsed.isSuccess) {
    throw new Error(parsed.message || 'Failed to load bookmarked posts')
  }

  return parsed.data
}
