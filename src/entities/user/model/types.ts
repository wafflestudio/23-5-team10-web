import { z } from 'zod'
import {
  CurrentUserSchema,
  ProfileUserSchema,
  SearchUserSchema,
} from './schema'

export type CurrentUser = z.infer<typeof CurrentUserSchema>
export type SearchUser = z.infer<typeof SearchUserSchema>
export type ProfileUser = z.infer<typeof ProfileUserSchema>
