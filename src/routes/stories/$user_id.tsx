import { createFileRoute } from '@tanstack/react-router'
import { StoryViewer } from '@/features/story-viewer/ui/StoryViewer'
import { useStoryFeedQuery } from '@/entities/story/model/hooks/useStoryFeedQuery'
import { useQuery } from '@tanstack/react-query'
import { getStoryDetail } from '@/entities/story/api/getStoryDetail'

export const Route = createFileRoute('/stories/$user_id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user_id } = Route.useParams()

  const { data: feedData, isLoading: isFeedLoading } = useStoryFeedQuery()

  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ['stories', 'user', user_id],
    queryFn: () => getStoryDetail(user_id),
    enabled: !!user_id,
  })

  if (isFeedLoading || isDetailLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-white" />
      </div>
    )
  }

  if (!feedData || !detailData) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        <p>표시할 스토리가 없습니다.</p>
      </div>
    )
  }

  const mergedFeed = feedData.map((item) =>
    String(item.userId) === String(user_id) ? detailData : item
  )

  return (
    <div className="h-screen w-full bg-black">
      <StoryViewer feed={mergedFeed} userId={user_id} />
    </div>
  )
}
