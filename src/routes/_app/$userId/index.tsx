import { createFileRoute } from '@tanstack/react-router'

import { ProfilePostsGrid } from '@/features/profile-posts/ui/ProfilePostsGrid'
import { EmptyPostsState } from '@/features/profile-posts/ui/EmptyPostsState'
import { ContentContainer } from '@/widgets/profile-layout'
import { useUserPostsQuery } from '@/entities/post/model/hooks/useUserPostsQuery'
import { useProfile } from '@/entities/user/model/hooks/useProfile'

export const Route = createFileRoute('/_app/$userId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()
  const numericUserId = Number(userId)
  const { data: posts, isLoading } = useUserPostsQuery({
    userId: numericUserId,
  })
  const { data: profile } = useProfile(numericUserId)

  if (isLoading) {
    return (
      <ContentContainer className="py-6">
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse bg-gray-200" />
          ))}
        </div>
      </ContentContainer>
    )
  }

  const items =
    posts?.map((post) => ({
      id: String(post.id),
      imageSrc: post.images[0]?.url,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
    })) ?? []

  if (items.length === 0) {
    return (
      <ContentContainer className="py-6">
        <EmptyPostsState isMe={profile?.isMe ?? false} />
      </ContentContainer>
    )
  }

  return (
    <ContentContainer className="py-6">
      <ProfilePostsGrid items={items} />
    </ContentContainer>
  )
}
