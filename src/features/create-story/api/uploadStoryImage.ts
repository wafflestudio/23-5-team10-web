import ky from 'ky'

import { cropImageToStoryRatio } from '@/features/create-story/lib/cropImageToStoryRatio'

const API_URL = import.meta.env.VITE_API_URL

export async function uploadStoryImage(file: File): Promise<string> {
  const croppedFile = await cropImageToStoryRatio(file)

  const formData = new FormData()
  formData.append('image', croppedFile)

  const response = await ky.post(`${API_URL}/api/images/upload`, {
    body: formData,
    credentials: 'include',
    timeout: 60000,
  })

  const urls = await response.json<string[]>()
  return urls[0]
}
