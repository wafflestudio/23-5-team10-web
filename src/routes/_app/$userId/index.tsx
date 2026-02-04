import { createFileRoute } from '@tanstack/react-router'

import { ProfilePostsGrid } from '@/features/profile-posts/ui/ProfilePostsGrid'
import { ContentContainer } from '@/widgets/profile-layout'
import { useUserPostsQuery } from '@/entities/post/model/hooks/useUserPostsQuery'

export const Route = createFileRoute('/_app/$userId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()
  const { data: posts, isLoading } = useUserPostsQuery({
    userId: Number(userId),
  })

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

  return (
    <ContentContainer className="py-6">
      <ProfilePostsGrid items={items} />
    </ContentContainer>
  )
}
