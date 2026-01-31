import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRecentSearch } from '../../api/getRecentSearch'
import { postRecentSearch } from '../../api/postRecentSearch'
import { deleteRecentSearch } from '../../api/deleteRecentSearch'
import type { RecentSearchItem } from '../types'

const RECENT_SEARCH_QUERY_KEY = ['search', 'recent'] as const

export function useRecentSearchQuery() {
  return useQuery<RecentSearchItem[]>({
    queryKey: RECENT_SEARCH_QUERY_KEY,
    queryFn: getRecentSearch,
    staleTime: Infinity,
  })
}

export function useAddRecentSearchMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postRecentSearch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECENT_SEARCH_QUERY_KEY })
    },
  })
}

export function useDeleteRecentSearchMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRecentSearch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECENT_SEARCH_QUERY_KEY })
    },
  })
}
