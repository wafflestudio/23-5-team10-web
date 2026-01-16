import { cn } from '@/shared/lib/utils'

import { ProfilePostTile } from './ProfilePostTile'

export type ProfilePostGridItem = {
  id: string
  imageSrc?: string
  likeCount: number
  commentCount: number
}

type ProfilePostsGridProps = {
  className?: string
  items: ProfilePostGridItem[]
}

export function ProfilePostsGrid({ className, items }: ProfilePostsGridProps) {
  return (
    <div className={cn('grid grid-cols-3 gap-1', className)}>
      {items.map((item) => (
        <ProfilePostTile
          key={item.id}
          imageSrc={item.imageSrc}
          likeCount={item.likeCount}
          commentCount={item.commentCount}
        />
      ))}
    </div>
  )
}
