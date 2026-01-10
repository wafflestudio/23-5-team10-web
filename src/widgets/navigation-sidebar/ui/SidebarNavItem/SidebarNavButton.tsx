import { SidebarMenuButton, SidebarMenuItem } from '@/shared/ui/sidebar'
import { SidebarNavItemBase } from './SidebarNavItemBase'
import type { SidebarNavItemBaseProps } from './SidebarNavItemBase'
import { DEFAULT_NAV_ITEM_CLASS_NAME } from './constants'
import { cn } from '@/shared/lib/utils'

type SidebarNavButtonProps = SidebarNavItemBaseProps & {
  onClick: () => void
}

const COMPACT_NAV_ITEM_CLASS_NAME = 'w-12 justify-center gap-0 px-0'

export function SidebarNavButton({ onClick, ...rest }: SidebarNavButtonProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        size="lg"
        isActive={rest.isActive}
        className={cn(
          DEFAULT_NAV_ITEM_CLASS_NAME,
          rest.isCompact && COMPACT_NAV_ITEM_CLASS_NAME
        )}
        onClick={onClick}
      >
        <SidebarNavItemBase {...rest} />
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
