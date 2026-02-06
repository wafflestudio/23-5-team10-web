import { User } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

type DefaultProfileImageProps = {
  className?: string
}

export function DefaultProfileImage({ className }: DefaultProfileImageProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gray-200',
        className
      )}
    >
      <User className="size-[60%] stroke-[1.5] text-gray-400" />
    </div>
  )
}
