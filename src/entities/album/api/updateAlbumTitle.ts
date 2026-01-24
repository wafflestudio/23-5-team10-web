import { instance } from '@/shared/api/ky'
import { CreateAlbumRequestSchema } from '@/entities/album/model/schema'
import type { CreateAlbumRequest } from '@/entities/album/model/types'

export async function updateAlbumTitle(
  albumId: number,
  payload: CreateAlbumRequest
): Promise<void> {
  const parsedRequest = CreateAlbumRequestSchema.parse(payload)

  const response = await instance.patch(`api/v1/albums/${albumId}`, {
    json: parsedRequest,
  })

  if (!response.ok) {
    throw new Error('Failed to update album title')
  }
}
