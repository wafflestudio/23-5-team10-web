import { instance } from '@/shared/api/ky'
import { FollowListResponseSchema, type FollowUser } from '../model/schema'

type GetFollowingParams = {
  userId: number
}

export async function getFollowing({
  userId,
}: GetFollowingParams): Promise<FollowUser[]> {
  const response = await instance.get(`api/v1/follows/${userId}/following`)
  const raw = await response.json()
  const parsed = FollowListResponseSchema.parse(raw)
  return parsed.data
}
