import { instance } from '@/shared/api/ky'
import { RecentSearchListResponseSchema } from '../model/schema'
import type { RecentSearchItem } from '../model/types'

export async function getRecentSearch(): Promise<RecentSearchItem[]> {
  const response = await instance.get('api/v1/search/recent')
  const raw = await response.json()
  const parsed = RecentSearchListResponseSchema.parse(raw)

  if (!parsed.isSuccess) {
    throw new Error(parsed.message || 'Failed to load recent searches')
  }

  return parsed.data.items ?? []
}
