import { instance } from '@/shared/api/ky'
import {
  BookmarkedPostSchema,
  ApiResponseSchema,
} from '@/entities/post/model/schema'
import type { BookmarkedPost } from '@/entities/post/model/types'

export async function getBookmarkedPosts(): Promise<BookmarkedPost[]> {
  const response = await instance.get('api/v1/posts/bookmarks')

  const raw = await response.json()

  const parsed = ApiResponseSchema(BookmarkedPostSchema.array()).parse(raw)

  if (!parsed.success) {
    throw new Error(parsed.message || 'Failed to load bookmarked posts')
  }

  return parsed.data
}
