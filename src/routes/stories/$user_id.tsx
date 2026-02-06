import { createFileRoute } from '@tanstack/react-router'
import { StoryViewer } from '@/features/story-viewer/ui/StoryViewer'
import { useStoryFeedQuery } from '@/entities/story/model/hooks/useStoryFeedQuery'

export const Route = createFileRoute('/stories/$user_id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user_id } = Route.useParams()
  const { data: feedData, isLoading } = useStoryFeedQuery()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-white" />
      </div>
    )
  }

  if (!feedData || feedData.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        <p>표시할 스토리가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-full bg-black">
      <StoryViewer feed={feedData} userId={user_id} />
    </div>
  )
}
