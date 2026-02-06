import { instance } from '@/shared/api/ky'
import {
  AlbumDetailSchema,
  ApiResponseSchema,
} from '@/entities/album/model/schema'
import type { AlbumDetail } from '@/entities/album/model/types'

type GetAlbumDetailParams = {
  albumId: number
  loggedInUser: number | null
  ownerId?: number
}

export async function getAlbumDetail({
  albumId,
  loggedInUser,
  ownerId,
}: GetAlbumDetailParams): Promise<AlbumDetail> {
  const searchParams = new URLSearchParams()
  if (loggedInUser !== null) {
    searchParams.set('loggedInUser', String(loggedInUser))
  }
  if (albumId === -1 && ownerId !== undefined) {
    searchParams.set('ownerId', String(ownerId))
  }
  const response = await instance.get(`api/v1/albums/${albumId}`, {
    searchParams,
  })

  const raw = await response.json()

  const parsed = ApiResponseSchema(AlbumDetailSchema).parse(raw)

  if (!parsed.isSuccess) {
    throw new Error(parsed.message || 'Failed to load album')
  }

  return parsed.data
}
