import { instance } from '@/shared/api/ky'
import { DeleteRecentSearchResponseSchema } from '../model/schema'

type DeleteRecentSearchParams = {
  toUserId: number
}

export async function deleteRecentSearch({
  toUserId,
}: DeleteRecentSearchParams): Promise<void> {
  const response = await instance.delete('api/v1/search/recent', {
    json: { toUserId },
  })
  const raw = await response.json()
  const parsed = DeleteRecentSearchResponseSchema.parse(raw)

  if (!parsed.isSuccess) {
    throw new Error(parsed.message || 'Failed to delete recent search')
  }
}
