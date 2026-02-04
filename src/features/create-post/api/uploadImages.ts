import { instance } from '@/shared/api/ky'
import { cropImagesToSquare } from '@/features/create-post/lib/cropImageToSquare'

export async function uploadImages(files: File[]): Promise<string[]> {
  const croppedFiles = await cropImagesToSquare(files)

  const formData = new FormData()
  croppedFiles.forEach((file) => {
    formData.append('image', file)
  })

  const response = await instance.post('api/images/upload', {
    body: formData,
    headers: {
      'Content-Type': undefined,
    },
    timeout: 60000,
  })

  return response.json<string[]>()
}
