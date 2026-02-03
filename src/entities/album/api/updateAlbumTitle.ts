import { instance } from '@/shared/api/ky'
import { CreateAlbumRequestSchema } from '@/entities/album/model/schema'
import type { CreateAlbumRequest } from '@/entities/album/model/types'

type UpdateAlbumTitleParams = {
  albumId: number
  payload: CreateAlbumRequest
  loggedInUser: number | null
}

export async function updateAlbumTitle({
  albumId,
  payload,
  loggedInUser,
}: UpdateAlbumTitleParams): Promise<void> {
  const parsedRequest = CreateAlbumRequestSchema.parse(payload)

  const searchParams = new URLSearchParams()
  if (loggedInUser !== null) {
    searchParams.set('loggedInUser', String(loggedInUser))
  }
  const response = await instance.patch(`api/v1/albums/${albumId}`, {
    json: parsedRequest,
    searchParams,
  })

  if (!response.ok) {
    throw new Error('Failed to update album title')
  }
}
