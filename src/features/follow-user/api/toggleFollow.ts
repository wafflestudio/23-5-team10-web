import { instance } from '@/shared/api/ky'

type ToggleFollowParams = {
  userId: number
  loggedInUser: number | null
}

export async function toggleFollow({
  userId,
  loggedInUser,
}: ToggleFollowParams) {
  const searchParams = new URLSearchParams()
  if (loggedInUser !== null) {
    searchParams.set('loggedInUser', String(loggedInUser))
  }
  await instance.post(`api/v1/follows/${userId}`, { searchParams })
}
