import { instance } from '@/shared/api/ky'
import { cropImageToStoryRatio } from '@/features/create-story/lib/cropImageToStoryRatio'

export async function uploadStoryImage(file: File): Promise<string> {
  const croppedFile = await cropImageToStoryRatio(file)

  const formData = new FormData()
  formData.append('image', croppedFile)

  const response = await instance.post('api/images/upload', {
    body: formData,
    headers: {
      'Content-Type': undefined,
    },
    timeout: 60000,
  })

  const urls = await response.json<string[]>()
  return urls[0]
}
