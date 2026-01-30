import { instance } from '@/shared/api/ky'
import {
  AlbumSummarySchema,
  ApiResponseSchema,
} from '@/entities/album/model/schema'
import type { AlbumSummary } from '@/entities/album/model/types'

export async function getMyAlbums(): Promise<AlbumSummary[]> {
  const response = await instance.get('api/v1/albums/my')

  const raw = await response.json()

  const parsed = ApiResponseSchema(AlbumSummarySchema.array()).parse(raw)

  if (!parsed.isSuccess) {
    throw new Error(parsed.message || 'Failed to load albums')
  }

  return parsed.data
}
