import { z } from 'zod'
import {
  CurrentUserSchema,
  ProfileUserSchema,
  SearchUserSchema,
  UpdateProfileRequestSchema,
} from './schema'

export type CurrentUser = z.infer<typeof CurrentUserSchema>
export type SearchUser = z.infer<typeof SearchUserSchema>
export type ProfileUser = z.infer<typeof ProfileUserSchema>
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>
