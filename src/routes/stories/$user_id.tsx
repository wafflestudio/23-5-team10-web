import { createFileRoute } from '@tanstack/react-router'
import { StoryViewer } from '@/features/story-viewer/ui/StoryViewer'
import { useStoryFeedQuery } from '@/entities/story/model/hooks/useStoryFeedQuery'

export const Route = createFileRoute('/stories/$user_id')({
  component: StoryDetailRouteComponent,
})

function StoryDetailRouteComponent() {
  const { user_id } = Route.useParams()
  const { data: feed, isLoading } = useStoryFeedQuery()

  if (isLoading || !feed) return <div className="h-screen w-screen bg-black" />

  return <StoryViewer feed={feed} userId={user_id} />
}
