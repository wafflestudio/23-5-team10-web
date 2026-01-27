import { z } from 'zod'

export const PostImageSchema = z.object({
  id: z.number(),
  url: z.string(),
  orderIndex: z.number(),
})

export const PostListItemSchema = z.object({
  id: z.number(),
  userId: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string(),
  content: z.string(),
  albumId: z.number().nullable(),
  images: z.array(PostImageSchema),
  likeCount: z.number(),
  commentCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  liked: z.boolean(),
  bookmarked: z.boolean(),
})

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    code: z.string(),
    message: z.string(),
    data: dataSchema,
    success: z.boolean(),
  })
