import { instance } from '@/shared/api/ky'
import { FollowListResponseSchema, type FollowUser } from '../model/schema'

type GetFollowingParams = {
  userId: number
  loggedInUser: number | null
}

export async function getFollowing({
  userId,
  loggedInUser,
}: GetFollowingParams): Promise<FollowUser[]> {
  const searchParams = new URLSearchParams()
  if (loggedInUser !== null) {
    searchParams.set('loggedInUser', String(loggedInUser))
  }
  const response = await instance.get(`api/v1/follows/${userId}/following`, {
    searchParams,
  })
  const raw = await response.json()
  const parsed = FollowListResponseSchema.parse(raw)
  return parsed.data
}
