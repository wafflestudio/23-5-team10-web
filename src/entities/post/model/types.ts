import { z } from 'zod'
import {
  PostListItemSchema,
  PostImageSchema,
  ApiResponseSchema,
} from './schema'

export type PostImage = z.infer<typeof PostImageSchema>
export type PostListItem = z.infer<typeof PostListItemSchema>

export type ApiResponse<T> = z.infer<
  ReturnType<typeof ApiResponseSchema<z.ZodType<T>>>
>
