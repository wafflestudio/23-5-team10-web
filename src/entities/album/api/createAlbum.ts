import { instance } from '@/shared/api/ky'
import {
  CreateAlbumRequestSchema,
  CreateAlbumResponseSchema,
} from '@/entities/album/model/schema'
import type {
  CreateAlbumRequest,
  CreateAlbumResponse,
} from '@/entities/album/model/types'

type CreateAlbumParams = {
  payload: CreateAlbumRequest
  loggedInUser: number | null
}

export async function createAlbum({
  payload,
  loggedInUser,
}: CreateAlbumParams): Promise<number> {
  const parsedRequest = CreateAlbumRequestSchema.parse(payload)

  const searchParams = new URLSearchParams()
  if (loggedInUser !== null) {
    searchParams.set('loggedInUser', String(loggedInUser))
  }
  const response = await instance.post('api/v1/albums', {
    json: parsedRequest,
    searchParams,
  })

  const raw = await response.json()

  const parsed = CreateAlbumResponseSchema.parse(raw) as CreateAlbumResponse

  if (!parsed.isSuccess) {
    throw new Error(parsed.message || 'Failed to create album')
  }

  return parsed.data
}
