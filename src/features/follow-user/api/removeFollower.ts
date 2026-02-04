import { instance } from '@/shared/api/ky'

type RemoveFollowerParams = {
  followerId: number
}

export async function removeFollower({ followerId }: RemoveFollowerParams) {
  await instance.delete(`api/v1/follows/followers/${followerId}`)
}
