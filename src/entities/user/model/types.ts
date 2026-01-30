import { z } from 'zod'
import { SearchUserSchema } from './schema'

export type SearchUser = z.infer<typeof SearchUserSchema>
