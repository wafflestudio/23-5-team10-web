import { z } from 'zod'

export const CurrentUserSchema = z.object({
  userId: z.number(),
  email: z.string(),
  nickname: z.string(),
  name: z.string().nullable(),
  profileImageUrl: z.string().nullable(),
  bio: z.string().nullable(),
  role: z.string(),
})

export const CurrentUserResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: CurrentUserSchema,
  isSuccess: z.boolean(),
})

export const SearchUserSchema = z.object({
  userId: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string().nullable(),
  name: z.string().nullable(),
  followed: z.boolean(),
})

export const SearchUserResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: z.object({
    users: z.array(SearchUserSchema),
  }),
  isSuccess: z.boolean(),
})

export const ProfileUserSchema = z.object({
  userId: z.number(),
  nickname: z.string(),
  name: z.string().nullable(),
  bio: z.string().nullable(),
  profileImageUrl: z.string().nullable(),
  postsCount: z.number(),
  followerCount: z.number(),
  followingCount: z.number(),
  me: z.boolean(),
  followed: z.boolean(),
})

export const ProfileUserResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: ProfileUserSchema,
  isSuccess: z.boolean(),
})
