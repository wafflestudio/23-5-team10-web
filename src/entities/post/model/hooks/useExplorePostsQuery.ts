import { useQuery } from '@tanstack/react-query'
import { getExplorePosts } from '@/entities/post/api/getExplorePosts'
import type { PostListItem } from '@/entities/post/model/types'

export function useExplorePostsQuery() {
  return useQuery<PostListItem[]>({
    queryKey: ['posts', 'explore'],
    queryFn: () => getExplorePosts(),
    retry: false,
  })
}
