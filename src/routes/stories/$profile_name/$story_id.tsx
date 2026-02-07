import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { StoryViewer } from '@/features/story-viewer/ui/StoryViewer'
import { useQuery } from '@tanstack/react-query'
import { getStoryDetail } from '@/entities/story/api/getStoryDetail'
import { useProfile } from '@/entities/user/model/hooks/useProfile'
import { useCallback, useMemo } from 'react'
import type { StoryFeedItem } from '@/entities/story/model/types'
import { z } from 'zod'

const searchSchema = z.object({
  returnTo: z.string().optional(),
})

export const Route = createFileRoute('/stories/$profile_name/$story_id')({
  component: RouteComponent,
  validateSearch: searchSchema,
})

function RouteComponent() {
  const { profile_name: userId } = Route.useParams()
  const { returnTo } = Route.useSearch()
  const navigate = useNavigate()
  const { data: profileData } = useProfile(Number(userId))

  const handleClose = useCallback(() => {
    if (returnTo) {
      navigate({ to: returnTo })
    } else {
      navigate({ to: '/$userId', params: { userId } })
    }
  }, [navigate, returnTo, userId])

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
        onClose={handleClose}
      />
    </div>
  )
}
