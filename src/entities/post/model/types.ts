import { z } from 'zod'
import {
  BookmarkedPostSchema,
  PostImageSchema,
  ApiResponseSchema,
} from './schema'

export type PostImage = z.infer<typeof PostImageSchema>
export type BookmarkedPost = z.infer<typeof BookmarkedPostSchema>

export type ApiResponse<T> = z.infer<
  ReturnType<typeof ApiResponseSchema<z.ZodType<T>>>
>
