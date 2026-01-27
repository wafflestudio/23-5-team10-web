import { ContentContainer } from '@/widgets/profile-layout'
import { useExplorePostsQuery } from '@/entities/post/model/hooks/useExplorePostsQuery'
import { AppFooter } from '@/shared/ui/app-footer'

import { ExplorePostGrid } from '@/features/explore/ui/ExplorePostGrid'

export function ExplorePage() {
  const { data: posts = [], isLoading } = useExplorePostsQuery()

  if (isLoading) {
    return (
      <ContentContainer className="py-6">
        <div className="py-12 text-center text-sm text-zinc-500">
          로딩 중...
        </div>
      </ContentContainer>
    )
  }

  return (
    <ContentContainer className="flex flex-col gap-0 py-6">
      <ExplorePostGrid items={posts} />
      <AppFooter />
    </ContentContainer>
  )
}
