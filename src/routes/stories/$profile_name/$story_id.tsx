import { createFileRoute } from '@tanstack/react-router'
import { StoryViewer } from '@/features/story-viewer/ui/StoryViewer'
import { useQuery } from '@tanstack/react-query'
import { getStoryDetail } from '@/entities/story/api/getStoryDetail'
import { useProfile } from '@/entities/user/model/hooks/useProfile'
import { useMemo } from 'react'
import type { StoryFeedItem } from '@/entities/story/model/types'

export const Route = createFileRoute('/stories/$profile_name/$story_id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { profile_name: userId } = Route.useParams()
  const { data: profileData } = useProfile(Number(userId))

  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ['stories', 'user', userId],
    queryFn: () => getStoryDetail(userId),
    enabled: !!userId,
  })

  const userStoryFeedItem: StoryFeedItem | undefined = useMemo(() => {
    if (!detailData || !profileData) return undefined
    return {
      userId: String(profileData.userId),
      nickname: profileData.nickname,
      profileImageUrl: profileData.profileImageUrl,
      hasUnseenStory: detailData.hasUnseenStory,
      stories: detailData.stories,
    }
  }, [detailData, profileData])

  const feed = useMemo(() => {
    if (!userStoryFeedItem) return []
    return [userStoryFeedItem]
  }, [userStoryFeedItem])

  if (isDetailLoading || !userStoryFeedItem) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-white" />
      </div>
    )
  }

  return (
    <div className="h-screen w-full bg-black">
      <StoryViewer
        feed={feed}
        userId={userId}
        detailUser={userStoryFeedItem}
        isDetailLoading={isDetailLoading}
      />
    </div>
  )
}
