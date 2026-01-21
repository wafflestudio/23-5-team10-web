import type { FeedItem } from '@/entities/feed/model/types'
import { useNavigate } from '@tanstack/react-router'
import { FeedCard } from '@/entities/feed/ui/FeedCard'

export function FeedList({ items }: { items: FeedItem[] }) {
  const navigate = useNavigate()

  return (
    <div className="grid h-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <FeedCard
          key={item.postId}
          item={item}
          onOpenPost={(postId) =>
            navigate({
              to: '/p/$post_id',
              params: { post_id: String(postId) },
            })
          }
          onToggleLike={(postId, liked) => console.log('like', postId, liked)}
          onToggleBookmark={(postId, bookmarked) =>
            console.log('bookmark', postId, bookmarked)
          }
        />
      ))}
    </div>
  )
}
