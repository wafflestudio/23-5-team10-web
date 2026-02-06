import { instance } from '@/shared/api/ky'
import { DeleteRecentSearchResponseSchema } from '../model/schema'

export async function deleteAllRecentSearch(): Promise<void> {
  const response = await instance.delete('api/v1/search/recent/all')
  const raw = await response.json()
  const parsed = DeleteRecentSearchResponseSchema.parse(raw)

  if (!parsed.isSuccess) {
    throw new Error(parsed.message || 'Failed to clear all recent search')
  }
}
