import { instance } from '@/shared/api/ky'
import {
  AlbumDetailSchema,
  ApiResponseSchema,
} from '@/entities/album/model/schema'
import type { AlbumDetail } from '@/entities/album/model/types'

export async function getAlbumDetail(albumId: number): Promise<AlbumDetail> {
  const response = await instance.get(`api/v1/albums/${albumId}`)

  const raw = await response.json()

  const parsed = ApiResponseSchema(AlbumDetailSchema).parse(raw)

  if (!parsed.isSuccess) {
    throw new Error(parsed.message || 'Failed to load album')
  }

  return parsed.data
}
