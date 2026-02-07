import { z } from 'zod'
import { instance } from '@/shared/api/ky'
import { UserStoriesDataSchema } from '@/entities/story/model/schema'
import type { UserStoriesData } from '@/entities/story/model/types'

const UserStoriesResponseSchema = z.object({
  isSuccess: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: UserStoriesDataSchema,
})

export async function getUserStories(userId: number): Promise<UserStoriesData> {
  const response = await instance.get(`api/v1/stories/user/${userId}`)
  const raw = await response.json()
  const parsed = UserStoriesResponseSchema.parse(raw)

  return parsed.data
}
