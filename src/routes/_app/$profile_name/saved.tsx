import { createFileRoute } from '@tanstack/react-router'

import { ProfileContentContainer } from '@/widgets/profile-layout'
import { ProfilePostsGrid } from '@/features/profile-posts/ui/ProfilePostsGrid'
import { useBookmarkedPostsQuery } from '@/entities/post/model/hooks/useBookmarkedPostsQuery'
import type { ProfilePostGridItem } from '@/features/profile-posts/ui/ProfilePostsGrid'

export const Route = createFileRoute('/_app/$profile_name/saved')({
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
      <ProfileContentContainer className="py-6">
        <div>Loading...</div>
      </ProfileContentContainer>
    )
  }

  return (
    <ProfileContentContainer className="py-6">
      <ProfilePostsGrid items={items} />
    </ProfileContentContainer>
  )
}
