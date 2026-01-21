import { z } from 'zod'
import {
  FeedAuthorSchema,
  FeedItemSchema,
  FeedPageSchema,
  ApiResponseSchema,
} from './schema'

export type FeedAuthor = z.infer<typeof FeedAuthorSchema>
export type FeedItem = z.infer<typeof FeedItemSchema>
export type FeedPage = z.infer<typeof FeedPageSchema>

export type GetFeedParams = {
  page?: number
  size?: number
}

export type ApiResponse<T> = z.infer<
  ReturnType<typeof ApiResponseSchema<z.ZodType<T>>>
>
