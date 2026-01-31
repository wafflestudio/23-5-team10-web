import { instance } from '@/shared/api/ky'
import { ProfileUserResponseSchema } from '../model/schema'
import type { ProfileUser } from '../model/types'

type GetProfileParams = {
  userId: number
}

export async function getProfile({
  userId,
}: GetProfileParams): Promise<ProfileUser> {
  const response = await instance.get(`api/v1/users/${userId}/profile`)
  const raw = await response.json()
  const parsed = ProfileUserResponseSchema.parse(raw)
  return parsed.data
}
