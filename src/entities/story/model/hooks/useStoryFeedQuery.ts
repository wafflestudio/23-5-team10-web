import { useQuery } from '@tanstack/react-query'
import { getStoryFeed } from '@/entities/story/api/getStoryFeed'

export function useStoryFeedQuery() {
  return useQuery({
    queryKey: ['stories', 'feed'],
    queryFn: getStoryFeed,
  })
}
