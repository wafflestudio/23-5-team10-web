import { StoryItem } from './StoryItem'
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel'

export function StoriesCarousel() {
  const stories = [
    {
      id: '1',
      profileName: 'test',
      storyId: '1',
    },
    {
      id: '2',
      profileName: 'test',
      storyId: '2',
    },
    {
      id: '3',
      profileName: 'test',
      storyId: '3',
    },
    {
      id: '4',
      profileName: 'test',
      storyId: '4',
    },
    {
      id: '5',
      profileName: 'test',
      storyId: '5',
    },
    {
      id: '6',
      profileName: 'test',
      storyId: '6',
    },
    {
      id: '7',
      profileName: 'test',
      storyId: '7',
    },
    {
      id: '8',
      profileName: 'test',
      storyId: '8',
    },
    {
      id: '9',
      profileName: 'test',
      storyId: '9',
    },
    {
      id: '10',
      profileName: 'test',
      storyId: '10',
    },
  ]
  return (
    <Carousel className="h-fit w-full" opts={{ slidesToScroll: 4 }}>
      <CarouselContent>
        {stories.map((story) => (
          <StoryItem key={story.id} {...story} />
        ))}
      </CarouselContent>
      <CarouselNext className="top-1/2 right-0 translate-y-[-50%]" />
      <CarouselPrevious className="top-1/2 left-0 translate-y-[-50%]" />
    </Carousel>
  )
}
