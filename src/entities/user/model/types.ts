import { z } from 'zod'
import { ProfileUserSchema, SearchUserSchema } from './schema'

export type SearchUser = z.infer<typeof SearchUserSchema>
export type ProfileUser = z.infer<typeof ProfileUserSchema>
