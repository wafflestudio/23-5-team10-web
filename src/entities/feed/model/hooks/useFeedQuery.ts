import { useQuery } from '@tanstack/react-query'
import { getFeed } from '@/entities/feed/api/getFeed'
import type { FeedPage } from '@/entities/feed/model/types'

type UseFeedQueryOptions = {
  page: number
  size: number
}

export function useFeedQuery({ page, size }: UseFeedQueryOptions) {
  return useQuery<FeedPage>({
    queryKey: ['feed', page, size],
    queryFn: () => getFeed({ page, size }),
    retry: false,
  })
}
