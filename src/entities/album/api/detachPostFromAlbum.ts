import { instance } from '@/shared/api/ky'

type DetachPostFromAlbumParams = {
  albumId: number
  postId: number
  loggedInUser: number | null
}

export async function detachPostFromAlbum({
  albumId,
  postId,
  loggedInUser,
}: DetachPostFromAlbumParams): Promise<void> {
  const searchParams = new URLSearchParams()
  if (loggedInUser !== null) {
    searchParams.set('loggedInUser', String(loggedInUser))
  }
  const response = await instance.delete(
    `api/v1/albums/${albumId}/posts/${postId}`,
    { searchParams }
  )

  if (!response.ok) {
    throw new Error('Failed to detach post from album')
  }
}
