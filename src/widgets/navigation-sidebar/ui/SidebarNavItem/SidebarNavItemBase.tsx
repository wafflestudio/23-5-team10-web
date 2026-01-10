import type { ComponentType } from 'react'
import { cn } from '@/shared/lib/utils'

export type SidebarNavItemBaseProps = {
  label: string
  icon: ComponentType<{ className?: string }>
  isActive?: boolean
  isCompact?: boolean
}

export function SidebarNavItemBase({
  label,
  icon: Icon,
  isActive,
  isCompact,
}: SidebarNavItemBaseProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={cn('shrink-0', isActive && 'text-foreground')} />
      <span
        className={cn(
          isCompact ? 'sr-only' : 'max-xl:sr-only',
          isActive && 'font-semibold'
        )}
      >
        {label}
      </span>
    </div>
  )
}
