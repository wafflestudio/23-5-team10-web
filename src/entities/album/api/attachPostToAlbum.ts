import { instance } from '@/shared/api/ky'

export async function attachPostToAlbum(params: {
  albumId: number
  postId: number
}): Promise<void> {
  const { albumId, postId } = params

  const response = await instance.post(
    `api/v1/albums/${albumId}/posts/${postId}`
  )

  if (!response.ok) {
    throw new Error('Failed to attach post to album')
  }
}
