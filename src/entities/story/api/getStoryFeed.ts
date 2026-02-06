import { instance } from '@/shared/api/ky'
import { StoryFeedResponseSchema } from '@/entities/story/model/schema'
import type { StoryFeedItem } from '@/entities/story/model/types'

export async function getStoryFeed(): Promise<StoryFeedItem[]> {
  const response = await instance.get('api/v1/stories/feed')
  const raw = await response.json()

  const parsed = StoryFeedResponseSchema.parse(raw)

  return parsed.data as unknown as StoryFeedItem[]
}
