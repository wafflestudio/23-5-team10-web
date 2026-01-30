import ky from 'ky'

import { cropImagesToSquare } from '@/features/create-post/lib/cropImageToSquare'

const API_URL = import.meta.env.VITE_API_URL

export async function uploadImages(files: File[]): Promise<string[]> {
  const croppedFiles = await cropImagesToSquare(files)

  const formData = new FormData()
  croppedFiles.forEach((file) => {
    formData.append('image', file)
  })

  const response = await ky.post(`${API_URL}/api/images/upload`, {
    body: formData,
    credentials: 'include',
    timeout: 60000,
  })

  return response.json<string[]>()
}
