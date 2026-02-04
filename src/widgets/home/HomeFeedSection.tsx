import { useSearch, useNavigate } from '@tanstack/react-router'

import { useFeedQuery } from '@/entities/feed/model/hooks/useFeedQuery'
import { FeedList } from '@/entities/feed/ui/FeedList'
import { FeedPagination } from '@/entities/feed/ui/FeedPagination'
import { EmptyFeedState } from '@/entities/feed/ui/EmptyFeedState'

export function HomeFeedSection() {
  const { page } = useSearch({ from: '/_app/' })
  const navigate = useNavigate()
  const size = 6

  const { data, isLoading, isError, error } = useFeedQuery({ page, size })

  const hasPrev = data?.hasPrev ?? page > 1
  const hasNext = data?.hasNext ?? false

  const handlePageChange = (newPage: number) => {
    navigate({
      to: '/',
      search: { page: newPage },
    })
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      {isLoading && (
        <div className="flex h-full w-full flex-1 items-center justify-center text-sm">
          피드를 불러오는 중…
        </div>
      )}

      {isError && (
        <div className="flex h-full w-full flex-1 items-center justify-center text-sm text-red-500">
          {(error as Error).message || '피드를 불러오지 못했습니다.'}
        </div>
      )}

      {data && data.items.length === 0 && <EmptyFeedState />}

      {data && data.items.length > 0 && <FeedList items={data.items} />}

      {data && (
        <FeedPagination
          page={page}
          totalPages={data.totalPages}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
