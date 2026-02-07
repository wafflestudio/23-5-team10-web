import { instance } from '@/shared/api/ky'
import { UserStoriesDataSchema } from '@/entities/story/model/schema'
import type { UserStoriesData } from '@/entities/story/model/types'

export async function getStoryDetail(userId: string): Promise<UserStoriesData> {
  const response = await instance.get(`api/v1/stories/user/${userId}`)
  const raw = (await response.json()) as { data: unknown }
  const parsed = UserStoriesDataSchema.parse(raw.data)
  return parsed
}
