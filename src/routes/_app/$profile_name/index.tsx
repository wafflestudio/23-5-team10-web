import { createFileRoute } from '@tanstack/react-router'

import { ProfilePostsGrid } from '@/features/profile-posts/ui/ProfilePostsGrid'
import { ContentContainer } from '@/widgets/profile-layout'

export const Route = createFileRoute('/_app/$profile_name/')({
  component: RouteComponent,
})

const FALLBACK_POST_COUNT = 12 // TODO: fetch real data

const FALLBACK_POST_ITEMS = Array.from(
  { length: FALLBACK_POST_COUNT },
  (_, i) => {
    const likeCount = 12 + i * 3
    const commentCount = 1 + (i % 5)

    return {
      id: `fallback-post-${i + 1}`,
      likeCount,
      commentCount,
    }
  }
)

function RouteComponent() {
  return (
    <ContentContainer className="py-6">
      <ProfilePostsGrid items={FALLBACK_POST_ITEMS} />
    </ContentContainer>
  )
}
