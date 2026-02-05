import { instance } from '@/shared/api/ky'

export async function uploadProfileImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('image', file)

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
