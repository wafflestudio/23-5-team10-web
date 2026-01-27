import type { AlbumSummary } from '@/entities/album/model/types'
import { cn } from '@/shared/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card'
import LazyImage from '@/shared/ui/lazyImage'

type AlbumSummaryCardProps = {
  album: AlbumSummary
  className?: string
}

export function AlbumSummaryCard({ album, className }: AlbumSummaryCardProps) {
  const { title, thumbnailImageUrl, postCount } = album

  return (
    <Card
      className={cn(
        'w-[260px] cursor-pointer gap-0 overflow-hidden rounded-2xl border-none py-0 shadow-md',
        className
      )}
    >
      <CardHeader className="flex items-start gap-2 px-4 py-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>

      <CardContent className="aspect-square px-0 pb-0">
        <div className="relative h-full overflow-hidden rounded-b-2xl">
          <LazyImage
            src={thumbnailImageUrl}
            alt={title}
            wrapperClassName="h-full w-full"
            className="h-full w-full"
          />

          <div className="pointer-events-none absolute inset-0 h-full w-full bg-linear-to-t from-black/35 via-black/5 to-transparent" />

          <div className="pointer-events-none absolute right-2 bottom-2">
            <div className="bg-background/90 text-foreground/90 inline-flex min-w-[40px] items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur">
              {postCount}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
