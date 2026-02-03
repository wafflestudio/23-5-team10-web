import { z } from 'zod'

import {
  AlbumDetailResponseSchema,
  AlbumDetailSchema,
  AlbumPostSchema,
  AlbumSummarySchema,
  ApiResponseSchema,
  CreateAlbumRequestSchema,
  CreateAlbumResponseSchema,
  UserAlbumsResponseSchema,
} from './schema'

export type CreateAlbumRequest = z.infer<typeof CreateAlbumRequestSchema>
export type CreateAlbumResponse = z.infer<typeof CreateAlbumResponseSchema>

export type AlbumPost = z.infer<typeof AlbumPostSchema>
export type AlbumDetail = z.infer<typeof AlbumDetailSchema>
export type AlbumSummary = z.infer<typeof AlbumSummarySchema>

export type AlbumDetailResponse = z.infer<typeof AlbumDetailResponseSchema>
export type UserAlbumsResponse = z.infer<typeof UserAlbumsResponseSchema>

export type ApiResponse<T> = z.infer<
  ReturnType<typeof ApiResponseSchema<z.ZodType<T>>>
>
