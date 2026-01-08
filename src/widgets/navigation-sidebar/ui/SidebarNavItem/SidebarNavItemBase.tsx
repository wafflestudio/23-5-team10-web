import type { ComponentType } from 'react'
import { cn } from '@/shared/lib/utils'

export type SidebarNavItemBaseProps = {
  label: string
  icon: ComponentType<{ className?: string }>
  isActive?: boolean
}

export function SidebarNavItemBase({
  label,
  icon: Icon,
  isActive,
}: SidebarNavItemBaseProps) {
  return (
    <>
      <Icon className={cn('shrink-0', isActive && 'text-foreground')} />
      <span className={cn('max-xl:sr-only', isActive && 'font-semibold')}>
        {label}
      </span>
    </>
  )
}
