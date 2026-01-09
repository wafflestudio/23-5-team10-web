import * as React from 'react'

import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils'

type FollowButtonProps = {
  className?: string
  defaultIsFollowing?: boolean
  onToggle?: (nextIsFollowing: boolean) => Promise<void> | void
}

const FOLLOW_BUTTON_LABEL = {
  follow: '팔로우',
  following: '팔로잉',
}

const FOLLOW_BUTTON_PRIMARY_CLASSNAME =
  'bg-[#0095f6] text-white hover:bg-[#0095f6]/90'

export function FollowButton({
  className,
  defaultIsFollowing = false,
  onToggle,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = React.useState(defaultIsFollowing)
  const [isPending, startTransition] = React.useTransition()

  const handleClick = () => {
    const nextIsFollowing = !isFollowing

    startTransition(() => {
      void (async () => {
        try {
          await onToggle?.(nextIsFollowing)
          setIsFollowing(nextIsFollowing)
        } catch {
          return
        }
      })()
    })
  }

  const label = isFollowing
    ? FOLLOW_BUTTON_LABEL.following
    : FOLLOW_BUTTON_LABEL.follow

  return (
    <Button
      type="button"
      aria-pressed={isFollowing}
      disabled={isPending}
      onClick={handleClick}
      className={cn(
        'h-8 rounded-md px-4 text-sm font-semibold',
        isFollowing
          ? 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
          : FOLLOW_BUTTON_PRIMARY_CLASSNAME,
        className
      )}
    >
      {label}
    </Button>
  )
}
