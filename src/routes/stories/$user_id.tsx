import { createFileRoute } from '@tanstack/react-router'
import { StoryViewer } from '@/features/story-viewer/ui/StoryViewer'
import { useStoryFeedQuery } from '@/entities/story/model/hooks/useStoryFeedQuery'
import { useQuery } from '@tanstack/react-query'
import { getStoryDetail } from '@/entities/story/api/getStoryDetail'
import { useProfile } from '@/entities/user/model/hooks/useProfile'
import { useMemo } from 'react'
import type { StoryFeedItem } from '@/entities/story/model/types'

export const Route = createFileRoute('/stories/$user_id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user_id } = Route.useParams()
  const { data: feedData } = useStoryFeedQuery()
  const { data: profileData } = useProfile(Number(user_id))

  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ['stories', 'user', user_id],
    queryFn: () => getStoryDetail(user_id),
    enabled: !!user_id,
  })

  const detailUser: StoryFeedItem | undefined = useMemo(() => {
    if (!detailData || !profileData) return undefined
    return {
      userId: String(profileData.userId),
      nickname: profileData.nickname,
      profileImageUrl: profileData.profileImageUrl,
      hasUnseenStory: detailData.hasUnseenStory,
      stories: detailData.stories,
    }
  }, [detailData, profileData])

  const mergedFeed = useMemo(() => {
    if (!feedData) return []

    if (!detailData) return feedData

    return feedData.map((item) =>
      String(item.userId) === String(user_id)
        ? { ...item, stories: detailData.stories }
        : item
    )
  }, [feedData, detailData, user_id])

  if (!feedData) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-white" />
      </div>
    )
  }

  return (
    <div className="h-screen w-full bg-black">
      <StoryViewer
        feed={mergedFeed}
        userId={user_id}
        detailUser={detailUser}
        isDetailLoading={isDetailLoading}
      />
    </div>
  )
}
