import { z } from 'zod'
import { RecentSearchItemSchema } from './schema'

export type RecentSearchItem = z.infer<typeof RecentSearchItemSchema>
