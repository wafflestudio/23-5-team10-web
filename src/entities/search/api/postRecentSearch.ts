import { instance } from '@/shared/api/ky'
import { PostRecentSearchResponseSchema } from '../model/schema'

type PostRecentSearchParams = {
  toUserId: number
}

export async function postRecentSearch({
  toUserId,
}: PostRecentSearchParams): Promise<number> {
  const response = await instance.post('api/v1/search/recent', {
    json: { toUserId },
  })
  const raw = await response.json()
  const parsed = PostRecentSearchResponseSchema.parse(raw)

  if (!parsed.isSuccess) {
    throw new Error(parsed.message || 'Failed to save recent search')
  }

  return parsed.data.searchId
}
