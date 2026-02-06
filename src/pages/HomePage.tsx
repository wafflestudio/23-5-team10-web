import { StoryFeed } from '@/widgets/stories'
import { HomeFeedSection } from '@/widgets/home/HomeFeedSection'
import { AppFooter } from '@/shared/ui/app-footer'

export const HomePage = () => {
  return (
    <div className="flex flex-1 flex-col gap-6 overflow-x-hidden px-20 py-10 2xl:px-52">
      <div className="shrink-0">
        <StoryFeed />
      </div>

      <HomeFeedSection />

      <AppFooter />
    </div>
  )
}
