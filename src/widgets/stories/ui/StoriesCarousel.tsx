import { StoryItem } from './StoryItem'
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel'
import { useStoryFeedQuery } from '@/entities/story/model/hooks/useStoryFeedQuery'

export function StoriesCarousel() {
  const { data: stories, isLoading } = useStoryFeedQuery()

  if (isLoading) {
    return (
      <div className="flex h-24 w-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
      </div>
    )
  }

  if (!stories || stories.length === 0) {
    return null
  }

  return (
    <Carousel className="h-fit w-full" opts={{ slidesToScroll: 4 }}>
      <CarouselContent>
        {stories.map((story) => (
          <StoryItem key={story.userId} {...story} />
        ))}
      </CarouselContent>
      <CarouselNext className="top-1/2 right-0 translate-y-[-50%]" />
      <CarouselPrevious className="top-1/2 left-0 translate-y-[-50%]" />
    </Carousel>
  )
}
