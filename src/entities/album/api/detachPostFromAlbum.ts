import { instance } from '@/shared/api/ky'

export async function detachPostFromAlbum(params: {
  albumId: number
  postId: number
}): Promise<void> {
  const { albumId, postId } = params

  const response = await instance.delete(
    `api/v1/albums/${albumId}/posts/${postId}`
  )

  if (!response.ok) {
    throw new Error('Failed to detach post from album')
  }
}
