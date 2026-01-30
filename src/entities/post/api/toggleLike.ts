import { instance } from '@/shared/api/ky'

type ToggleLikeResponse = {
  code: string
  message: string
  success: boolean
}

export async function likePost(postId: number): Promise<ToggleLikeResponse> {
  const response = await instance.post(`api/v1/posts/${postId}/like`)

  const raw = await response.json()

  return raw as ToggleLikeResponse
}

export async function unlikePost(postId: number): Promise<ToggleLikeResponse> {
  const response = await instance.delete(`api/v1/posts/${postId}/like`)

  const raw = await response.json()

  return raw as ToggleLikeResponse
}
