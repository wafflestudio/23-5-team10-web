import { z } from 'zod'

export const StorySchema = z.object({
  id: z.number(),
  userId: z.union([z.string(), z.number()]).transform((val) => String(val)),
  imageUrl: z.string(),
  createdAt: z.string(),
  expiresAt: z.string().optional(),
  viewCount: z.number().optional(),
})

export const StoryFeedItemSchema = z.object({
  userId: z.union([z.string(), z.number()]).transform((val) => String(val)),
  nickname: z.string(),
  profileImageUrl: z.string().nullable(),
  hasUnseenStory: z.boolean(),
  stories: z.array(StorySchema),
})

export const StoryFeedResponseSchema = z.object({
  isSuccess: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.array(StoryFeedItemSchema),
})
