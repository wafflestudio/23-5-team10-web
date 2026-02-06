import { useState, useEffect } from 'react'
import { StoryItem } from './StoryItem'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/shared/ui/carousel'
import { useStoryFeedQuery } from '@/entities/story/model/hooks/useStoryFeedQuery'

export function StoryFeed() {
  const { data: storyFeed, isLoading } = useStoryFeedQuery()
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!api) return

    const updateState = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    updateState()
    api.on('select', updateState)
    api.on('reInit', updateState)
  }, [api])

  if (isLoading) {
    return (
      <div className="flex h-28 w-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
      </div>
    )
  }

  if (!storyFeed || storyFeed.length === 0) return null

  return (
    <div className="relative w-full px-4 py-4">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: 'start',
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-6">
          {storyFeed.map((user) => (
            <CarouselItem key={user.userId} className="basis-auto pl-6">
              <StoryItem
                userId={user.userId}
                nickname={user.nickname}
                profileImageUrl={user.profileImageUrl}
                hasUnseenStory={user.hasUnseenStory}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {canScrollPrev && (
          <CarouselPrevious className="absolute top-[40%] left-2 h-8 w-8 border-none bg-white text-black shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:bg-white focus:ring-0" />
        )}

        {canScrollNext && (
          <CarouselNext className="absolute top-[40%] right-2 h-8 w-8 border-none bg-white text-black shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:bg-white focus:ring-0" />
        )}
      </Carousel>
    </div>
  )
}
