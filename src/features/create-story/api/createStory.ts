import { instance } from '@/shared/api/ky'

export type CreateStoryParams = {
  imageUrl: string
}

type CreateStoryResponse = {
  code: string
  message: string
  success: boolean
}

export async function createStory(
  params: CreateStoryParams
): Promise<CreateStoryResponse> {
  const response = await instance.post('api/v1/stories', {
    json: params,
  })

  return response.json<CreateStoryResponse>()
}
