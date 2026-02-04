import { instance } from '@/shared/api/ky'

type AttachPostToAlbumParams = {
  albumId: number
  postId: number
  loggedInUser: number | null
}

export async function attachPostToAlbum({
  albumId,
  postId,
  loggedInUser,
}: AttachPostToAlbumParams): Promise<void> {
  const searchParams = new URLSearchParams()
  if (loggedInUser !== null) {
    searchParams.set('loggedInUser', String(loggedInUser))
  }
  const response = await instance.post(
    `api/v1/albums/${albumId}/posts/${postId}`,
    { searchParams }
  )

  if (!response.ok) {
    throw new Error('Failed to attach post to album')
  }
}
