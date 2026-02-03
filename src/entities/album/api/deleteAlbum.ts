import { instance } from '@/shared/api/ky'

type DeleteAlbumParams = {
  albumId: number
  loggedInUser: number | null
}

export async function deleteAlbum({
  albumId,
  loggedInUser,
}: DeleteAlbumParams): Promise<void> {
  const searchParams = new URLSearchParams()
  if (loggedInUser !== null) {
    searchParams.set('loggedInUser', String(loggedInUser))
  }
  const response = await instance.delete(`api/v1/albums/${albumId}`, {
    searchParams,
  })

  if (!response.ok) {
    throw new Error('Failed to delete album')
  }
}
