import { instance } from '@/shared/api/ky'
import {
  CreateAlbumRequestSchema,
  CreateAlbumResponseSchema,
} from '@/entities/album/model/schema'
import type {
  CreateAlbumRequest,
  CreateAlbumResponse,
} from '@/entities/album/model/types'

export async function createAlbum(
  payload: CreateAlbumRequest
): Promise<number> {
  const parsedRequest = CreateAlbumRequestSchema.parse(payload)

  const response = await instance.post('api/v1/albums', {
    json: parsedRequest,
  })

  const raw = await response.json()

  const parsed = CreateAlbumResponseSchema.parse(raw) as CreateAlbumResponse

  if (!parsed.isSuccess) {
    throw new Error(parsed.message || 'Failed to create album')
  }

  return parsed.data
}
