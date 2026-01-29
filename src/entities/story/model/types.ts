import { z } from 'zod'
import { StoryFeedItemSchema } from './schema'

export type StoryFeedItem = z.infer<typeof StoryFeedItemSchema>
