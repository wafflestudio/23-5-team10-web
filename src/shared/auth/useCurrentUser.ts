import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getCurrentUser } from '@/entities/user/api/getCurrentUser'
import type { CurrentUser } from '@/entities/user/model/types'

export const currentUserQueryKey = ['currentUser'] as const

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCurrentUserId() {
  const { data } = useCurrentUser()
  return data?.userId ?? null
}

export function useInvalidateCurrentUser() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: currentUserQueryKey })
}

export function useClearCurrentUser() {
  const queryClient = useQueryClient()
  return () =>
    queryClient.setQueryData<CurrentUser | null>(currentUserQueryKey, null)
}
