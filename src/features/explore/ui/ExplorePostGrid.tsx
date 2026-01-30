import { useMemo } from 'react'

import { cn } from '@/shared/lib/utils'
import type { PostListItem } from '@/entities/post/model/types'

import { ExplorePostTile } from './ExplorePostTile'

export type LayoutTile = {
  item: PostListItem
  rowSpan: 1 | 2
}

function buildExploreLayout(items: PostListItem[]): LayoutTile[] {
  const n = items.length
  if (n === 0) return []

  const tailSize = Math.min(6, n)
  const headEnd = n - tailSize

  const layout: LayoutTile[] = []

  let i = 0
  let blockIndex = 0

  while (i < headEnd) {
    const remain = headEnd - i

    if (remain >= 5) {
      const bigIndex = blockIndex % 2 === 0 ? 0 : 2

      for (let j = 0; j < 5; j++) {
        layout.push({
          item: items[i + j],
          rowSpan: j === bigIndex ? 2 : 1,
        })
      }

      i += 5
      blockIndex++
      continue
    }

    for (; i < headEnd; i++) {
      layout.push({ item: items[i], rowSpan: 1 })
    }
  }

  for (let k = headEnd; k < n; k++) {
    layout.push({ item: items[k], rowSpan: 1 })
  }

  return layout
}

export type ExplorePostGridProps = {
  className?: string
  items: PostListItem[]
}

export function ExplorePostGrid({ className, items }: ExplorePostGridProps) {
  const layout = useMemo(() => buildExploreLayout(items), [items])

  return (
    <div
      className={cn(
        'grid w-full grid-flow-dense grid-cols-3 gap-0.5',
        className
      )}
      role="list"
    >
      {layout.map(({ item, rowSpan }) => (
        <ExplorePostTile key={item.id} item={item} rowSpan={rowSpan} />
      ))}
    </div>
  )
}
