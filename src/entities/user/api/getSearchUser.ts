import { instance } from '@/shared/api/ky'
import type { SearchUser } from '../model/types'
import { SearchUserResponseSchema } from '../model/schema'

export async function getSearchUser(query: string): Promise<SearchUser[]> {
  const response = await instance.get(`api/v1/users/search?q=${query}`)
  const raw = await response.json()
  const parsed = SearchUserResponseSchema.parse(raw)
  return parsed.data.users
}
