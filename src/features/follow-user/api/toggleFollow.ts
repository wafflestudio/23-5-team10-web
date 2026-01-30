import { instance } from '@/shared/api/ky'

type ToggleFollowParams = {
  userId: number
}

export async function toggleFollow({ userId }: ToggleFollowParams) {
  await instance.post(`api/v1/follows/${userId}`)
}
