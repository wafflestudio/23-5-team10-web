import { instance } from '@/shared/api/ky'
import { FeedPageSchema, ApiResponseSchema } from '@/entities/feed/model/schema'
import type { FeedPage, GetFeedParams } from '@/entities/feed/model/types'

export async function getFeed(params: GetFeedParams = {}): Promise<FeedPage> {
  const response = await instance.get('api/v1/feed', {
    searchParams: {
      page: params.page ?? 1,
      size: params.size ?? 6,
    },
  })

  const raw = await response.json()

  const parsed = ApiResponseSchema(FeedPageSchema).parse(raw)

  if (!parsed.success) {
    throw new Error(parsed.message || 'Failed to load feed')
  }

  return parsed.data
}
