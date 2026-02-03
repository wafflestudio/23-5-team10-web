import { z } from 'zod'

import { instance } from '@/shared/api/ky'
import {
  ApiResponseSchema,
  PostListItemSchema,
} from '@/entities/post/model/schema'

export type CreatePostParams = {
  content: string
  albumId?: number
  imageUrls: string[]
}

const CreatePostResponseSchema = ApiResponseSchema(PostListItemSchema)

export type CreatePostResponse = z.infer<typeof CreatePostResponseSchema>

export async function createPost(
  params: CreatePostParams
): Promise<CreatePostResponse> {
  const response = await instance.post('api/v1/posts', {
    json: {
      ...params,
      albumId: params.albumId === -1 ? null : params.albumId,
    },
  })

  const raw = await response.json()

  return CreatePostResponseSchema.parse(raw)
}
