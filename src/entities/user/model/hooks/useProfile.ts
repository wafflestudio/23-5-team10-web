import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../../api/getProfile'

export function useProfile(userId: number) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile({ userId }),
    enabled: userId > 0,
  })
}
