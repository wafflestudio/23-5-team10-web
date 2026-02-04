import { z } from 'zod'

export const CreateAlbumRequestSchema = z.object({
  title: z.string().min(1).max(50),
})

export const AlbumPostSchema = z.object({
  postId: z.number(),
  imageUrl: z.string().min(1),
})

export const AlbumDetailSchema = z.object({
  albumId: z.number(),
  title: z.string(),
  posts: z.array(AlbumPostSchema),
})

export const AlbumSummarySchema = z.object({
  albumId: z.number(),
  title: z.string(),
  thumbnailImageUrl: z
    .string()
    .nullable()
    .transform((val) => val ?? ''),
  postCount: z.number().int().nonnegative(),
})

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    code: z.string(),
    message: z.string(),
    data: dataSchema,
    isSuccess: z.boolean(),
  })

export const CreateAlbumResponseSchema = ApiResponseSchema(z.number())
export const AlbumDetailResponseSchema = ApiResponseSchema(AlbumDetailSchema)
export const UserAlbumsResponseSchema = ApiResponseSchema(
  z.array(AlbumSummarySchema)
)
