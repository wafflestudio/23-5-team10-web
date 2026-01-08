import { SidebarMenuItem } from '@/shared/ui/sidebar'
import { Link } from '@tanstack/react-router'
import type { FileRouteTypes } from '@tanstack/react-router'
import { SidebarNavItemBase } from './SidebarNavItemBase'
import type { SidebarNavItemBaseProps } from './SidebarNavItemBase'
import { SidebarMenuButton } from '@/shared/ui/sidebar'
import { DEFAULT_NAV_ITEM_CLASS_NAME } from './constants'
import { cn } from '@/shared/lib/utils'

type SidebarNavLinkProps = SidebarNavItemBaseProps & {
  to: FileRouteTypes['to']
}

const COMPACT_NAV_ITEM_CLASS_NAME = 'w-12 justify-center gap-0 px-0'

export function SidebarNavLink({ to, ...rest }: SidebarNavLinkProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        size="lg"
        isActive={rest.isActive}
        className={cn(
          DEFAULT_NAV_ITEM_CLASS_NAME,
          rest.isCompact && COMPACT_NAV_ITEM_CLASS_NAME
        )}
      >
        <Link to={to}>
          <SidebarNavItemBase {...rest} />
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
