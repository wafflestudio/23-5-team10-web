import ky from 'ky'

const API_URL = import.meta.env.VITE_API_URL

export async function uploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('image', file)
  })

  const response = await ky.post(`${API_URL}/api/images/upload`, {
    body: formData,
    credentials: 'include',
    timeout: 60000,
  })

  return response.json<string[]>()
}
