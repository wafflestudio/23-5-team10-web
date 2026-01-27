import { instance } from '@/shared/api/ky'

type ToggleBookmarkResponse = {
  code: string
  message: string
  success: boolean
}

export async function bookmarkPost(
  postId: number
): Promise<ToggleBookmarkResponse> {
  const response = await instance.post(`api/v1/posts/${postId}/bookmark`)

  const raw = await response.json()

  return raw as ToggleBookmarkResponse
}

export async function unbookmarkPost(
  postId: number
): Promise<ToggleBookmarkResponse> {
  const response = await instance.delete(`api/v1/posts/${postId}/bookmark`)

  const raw = await response.json()

  return raw as ToggleBookmarkResponse
}
