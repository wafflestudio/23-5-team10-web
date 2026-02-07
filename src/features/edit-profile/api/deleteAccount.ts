import { z } from 'zod'
import { instance } from '@/shared/api/ky'

const DeleteAccountResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: z.string(),
  isSuccess: z.boolean(),
})

export async function deleteAccount(): Promise<string> {
  const response = await instance.delete('api/v1/users/me')
  const raw = await response.json()
  const parsed = DeleteAccountResponseSchema.parse(raw)
  return parsed.data
}
