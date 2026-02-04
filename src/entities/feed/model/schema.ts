import { z } from 'zod'

export const FeedAuthorSchema = z.object({
  userId: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string().nullable(),
})

export const FeedItemSchema = z.object({
  postId: z.number(),
  author: FeedAuthorSchema,
  thumbnailImageUrl: z.string().min(1),
  likeCount: z.number().nonnegative(),
  commentCount: z.number().nonnegative(),
  createdAt: z.string(),
  isLiked: z.boolean().default(false),
  isBookmarked: z.boolean().default(false),
})

export const FeedPageSchema = z.object({
  items: z.array(FeedItemSchema),
  page: z.number().int().nonnegative(),
  size: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  totalElements: z.number().int().nonnegative(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
})

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    code: z.string(),
    message: z.string(),
    data: dataSchema,
    isSuccess: z.boolean(),
  })
