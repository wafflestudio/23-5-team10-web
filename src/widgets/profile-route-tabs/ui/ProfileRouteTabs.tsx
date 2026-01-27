import { Bookmark, Grid3X3 } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { ContentContainer } from '@/widgets/profile-layout'

export const PROFILE_ROUTE_TAB_VALUE = {
  POSTS: 'posts',
  SAVED: 'saved',
} as const

export type ProfileRouteTabValue =
  (typeof PROFILE_ROUTE_TAB_VALUE)[keyof typeof PROFILE_ROUTE_TAB_VALUE]

type ProfileRouteTabsProps = {
  className?: string
  value: ProfileRouteTabValue
  onValueChange: (value: ProfileRouteTabValue) => void
}

const TAB_TRIGGER_CLASSNAME =
  "relative inline-flex h-14 flex-none items-center justify-center gap-1.5 px-3 text-gray-500 shadow-none after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-transparent after:content-[''] hover:text-gray-700 data-[state=active]:text-gray-900 data-[state=active]:after:bg-gray-900 [&_svg]:size-6"

function isProfileRouteTabValue(value: string): value is ProfileRouteTabValue {
  return (
    value === PROFILE_ROUTE_TAB_VALUE.POSTS ||
    value === PROFILE_ROUTE_TAB_VALUE.SAVED
  )
}

export function ProfileRouteTabs({
  className,
  value,
  onValueChange,
}: ProfileRouteTabsProps) {
  const handleValueChange = (nextValue: string) => {
    if (!isProfileRouteTabValue(nextValue)) return
    onValueChange(nextValue)
  }

  return (
    <div className={cn('w-full', className)}>
      <ContentContainer>
        <Tabs
          value={value}
          onValueChange={handleValueChange}
          className="w-full gap-0"
        >
          <TabsList className="flex h-14 w-full justify-center gap-16 rounded-none bg-transparent p-0 text-gray-500">
            <TabsTrigger
              value={PROFILE_ROUTE_TAB_VALUE.POSTS}
              className={TAB_TRIGGER_CLASSNAME}
            >
              <Grid3X3 aria-hidden="true" />
              <span className="sr-only">게시물</span>
            </TabsTrigger>

            <TabsTrigger
              value={PROFILE_ROUTE_TAB_VALUE.SAVED}
              className={TAB_TRIGGER_CLASSNAME}
            >
              <Bookmark aria-hidden="true" />
              <span className="sr-only">저장됨</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </ContentContainer>
    </div>
  )
}
