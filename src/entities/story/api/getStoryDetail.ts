import { instance } from '@/shared/api/ky'
import { StoryFeedItemSchema } from '@/entities/story/model/schema'
import type { StoryFeedItem } from '@/entities/story/model/types'

export async function getStoryDetail(userId: string): Promise<StoryFeedItem> {
  const response = await instance.get(`api/v1/stories/user/${userId}`)
  const raw = (await response.json()) as { data: unknown }
  const parsed = StoryFeedItemSchema.parse(raw.data)
  return parsed
}
