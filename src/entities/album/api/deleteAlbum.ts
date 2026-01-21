import { instance } from '@/shared/api/ky'

export async function deleteAlbum(albumId: number): Promise<void> {
  const response = await instance.delete(`api/v1/albums/${albumId}`)

  if (!response.ok) {
    throw new Error('Failed to delete album')
  }
}
