import { z } from 'zod'
import {
  PostListItemSchema,
  PostImageSchema,
  ApiResponseSchema,
} from './schema'

export type PostImage = z.infer<typeof PostImageSchema>
export type PostListItem = z.infer<typeof PostListItemSchema>

export interface PostData {
  id: number
  userId: number
  nickname: string
  profileImageUrl: string
  content: string
  albumId: number | null
  images: PostImage[]
  likeCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
  isLiked: boolean
  isBookmarked: boolean
}

export type ApiResponse<T> = z.infer<
  ReturnType<typeof ApiResponseSchema<z.ZodType<T>>>
>
