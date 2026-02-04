import { useQuery } from '@tanstack/react-query'
import { useCurrentUserId } from '@/shared/auth/useCurrentUser'
import { getFollowers } from '../api/getFollowers'

type UseFollowersParams = {
  userId: number
  enabled?: boolean
}

export function useFollowers({ userId, enabled = true }: UseFollowersParams) {
  const loggedInUser = useCurrentUserId()

  return useQuery({
    queryKey: ['followers', userId, loggedInUser],
    queryFn: () => getFollowers({ userId, loggedInUser }),
    enabled: enabled && userId > 0,
    staleTime: Infinity,
  })
}
