import { instance } from '@/shared/api/ky'
import {
  CurrentUserResponseSchema,
  UpdateProfileRequestSchema,
} from '@/entities/user/model/schema'
import type { CurrentUser } from '@/entities/user/model/types'

export type UpdateProfilePayload = {
  nickname?: string
  name?: string
  bio?: string
  profileImageUrl?: string
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<CurrentUser> {
  const parsedRequest = UpdateProfileRequestSchema.parse(payload)
  const response = await instance.patch('api/v1/users/me', {
    json: parsedRequest,
  })
  const raw = await response.json()
  const parsed = CurrentUserResponseSchema.parse(raw)
  return parsed.data
}
