import { useQuery } from '@tanstack/react-query'
import { getBookmarkedPosts } from '@/entities/post/api/getBookmarkedPosts'
import type { PostListItem } from '@/entities/post/model/types'

export function useBookmarkedPostsQuery() {
  return useQuery<PostListItem[]>({
    queryKey: ['posts', 'bookmarks'],
    queryFn: () => getBookmarkedPosts(),
    retry: false,
  })
}
