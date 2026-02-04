import { useQuery } from '@tanstack/react-query'
import { useCurrentUserId } from '@/shared/auth/useCurrentUser'
import { getFollowing } from '../api/getFollowing'

type UseFollowingParams = {
  userId: number
  enabled?: boolean
}

export function useFollowing({ userId, enabled = true }: UseFollowingParams) {
  const loggedInUser = useCurrentUserId()

  return useQuery({
    queryKey: ['following', userId, loggedInUser],
    queryFn: () => getFollowing({ userId, loggedInUser }),
    enabled: enabled && userId > 0,
  })
}
