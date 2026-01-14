import { StoryItem } from './StoryItem'
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel'

export function StoriesCarousel() {
  return (
    <Carousel className="h-fit w-full" opts={{ slidesToScroll: 4 }}>
      <CarouselContent>
        <StoryItem />
        <StoryItem />
        <StoryItem />
        <StoryItem />
        <StoryItem />
        <StoryItem />
        <StoryItem />
        <StoryItem />
        <StoryItem />
        <StoryItem />
        <StoryItem />
        <StoryItem />
        <StoryItem />
        <StoryItem />
        <StoryItem />
        <StoryItem />
      </CarouselContent>
      <CarouselNext className="top-1/2 right-0 translate-y-[-50%]" />
      <CarouselPrevious className="top-1/2 left-0 translate-y-[-50%]" />
    </Carousel>
  )
}
