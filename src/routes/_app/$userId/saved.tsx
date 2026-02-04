import { createFileRoute } from '@tanstack/react-router'

import { ContentContainer } from '@/widgets/profile-layout'
import { ProfilePostsGrid } from '@/features/profile-posts/ui/ProfilePostsGrid'
import { EmptyBookmarksState } from '@/features/profile-posts/ui/EmptyBookmarksState'
import { useBookmarkedPostsQuery } from '@/entities/post/model/hooks/useBookmarkedPostsQuery'
import type { ProfilePostGridItem } from '@/features/profile-posts/ui/ProfilePostsGrid'

export const Route = createFileRoute('/_app/$userId/saved')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: bookmarkedPosts = [], isLoading } = useBookmarkedPostsQuery()

  const items: ProfilePostGridItem[] = bookmarkedPosts.map((post) => ({
    id: String(post.id),
    imageSrc: post.images[0]?.url,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
  }))

  if (isLoading) {
    return (
      <ContentContainer className="py-6">
        <div>Loading...</div>
      </ContentContainer>
    )
  }

  if (items.length === 0) {
    return (
      <ContentContainer className="py-6">
        <EmptyBookmarksState />
      </ContentContainer>
    )
  }

  return (
    <ContentContainer className="py-6">
      <ProfilePostsGrid items={items} />
    </ContentContainer>
  )
}
