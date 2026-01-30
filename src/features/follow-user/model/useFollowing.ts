import { useQuery } from '@tanstack/react-query'
import { getFollowing } from '../api/getFollowing'

type UseFollowingParams = {
  userId: number
  enabled?: boolean
}

export function useFollowing({ userId, enabled = true }: UseFollowingParams) {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: () => getFollowing({ userId }),
    enabled: enabled && userId > 0,
    staleTime: Infinity,
  })
}
