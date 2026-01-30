import { z } from 'zod'

export const SearchUserSchema = z.object({
  userId: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string(),
  name: z.string(),
  followed: z.boolean(),
})

export const SearchUserResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: z.object({
    users: z.array(SearchUserSchema),
  }),
  success: z.boolean(),
})
