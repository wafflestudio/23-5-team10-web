import { z } from 'zod'

export const RecentSearchItemSchema = z.object({
  searchId: z.number(),
  userId: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string(),
  name: z.string(),
  followed: z.boolean(),
})

export const RecentSearchListResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: z.object({
    items: z.array(RecentSearchItemSchema),
  }),
  success: z.boolean(),
})

export const PostRecentSearchResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: z.object({
    searchId: z.number(),
  }),
  success: z.boolean(),
})

export const DeleteRecentSearchResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  success: z.boolean(),
})
