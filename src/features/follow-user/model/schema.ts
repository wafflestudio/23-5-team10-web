import { z } from 'zod'

export const FollowUserSchema = z.object({
  userId: z.number(),
  nickname: z.string(),
  name: z.string().nullable(),
  profileImageUrl: z.string().nullable(),
  isFollowing: z.boolean(),
})

export const FollowListResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: z.array(FollowUserSchema),
  isSuccess: z.boolean(),
})

export type FollowUser = z.infer<typeof FollowUserSchema>
