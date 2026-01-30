import { instance } from '@/shared/api/ky'
import { FollowListResponseSchema, type FollowUser } from '../model/schema'

type GetFollowersParams = {
  userId: number
}

export async function getFollowers({
  userId,
}: GetFollowersParams): Promise<FollowUser[]> {
  const response = await instance.get(`api/v1/follows/${userId}/follower`)
  const raw = await response.json()
  const parsed = FollowListResponseSchema.parse(raw)
  return parsed.data
}
