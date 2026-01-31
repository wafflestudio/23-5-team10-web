import { useQuery } from '@tanstack/react-query'
import { getFollowers } from '../api/getFollowers'

type UseFollowersParams = {
  userId: number
  enabled?: boolean
}

export function useFollowers({ userId, enabled = true }: UseFollowersParams) {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: () => getFollowers({ userId }),
    enabled: enabled && userId > 0,
    staleTime: Infinity,
  })
}
