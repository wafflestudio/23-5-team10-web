import { z } from 'zod'

export const StoryFeedItemSchema = z.object({
  userId: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string().nullable(),
  hasUnseenStory: z.boolean(),
})

export const StoryFeedResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: z.array(StoryFeedItemSchema),
  isSuccess: z.boolean(),
})
