import { useQuery } from '@tanstack/react-query'
import { getUserStories } from '@/entities/story/api/getUserStories'

export function useUserStoriesQuery(userId: number) {
  return useQuery({
    queryKey: ['stories', 'user', userId],
    queryFn: () => getUserStories(userId),
    enabled: userId > 0,
  })
}
