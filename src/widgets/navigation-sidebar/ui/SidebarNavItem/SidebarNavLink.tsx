import { SidebarMenuItem } from '@/shared/ui/sidebar'
import { Link } from '@tanstack/react-router'
import type { FileRouteTypes } from '@tanstack/react-router'
import { SidebarNavItemBase } from './SidebarNavItemBase'
import type { SidebarNavItemBaseProps } from './SidebarNavItemBase'
import { SidebarMenuButton } from '@/shared/ui/sidebar'
import { DEFAULT_NAV_ITEM_CLASS_NAME } from './constants'

type SidebarNavLinkProps = SidebarNavItemBaseProps & {
  to: FileRouteTypes['to']
}

export function SidebarNavLink({ to, ...rest }: SidebarNavLinkProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        size="lg"
        isActive={rest.isActive}
        className={DEFAULT_NAV_ITEM_CLASS_NAME}
      >
        <Link to={to}>
          <SidebarNavItemBase {...rest} />
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
