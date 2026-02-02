import { instance } from '@/shared/api/ky'
import { CurrentUserResponseSchema } from '../model/schema'
import type { CurrentUser } from '../model/types'

export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await instance.get('api/v1/users/me')
  const raw = await response.json()
  const parsed = CurrentUserResponseSchema.parse(raw)
  return parsed.data
}
