import { SidebarMenuItem } from '@/shared/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { SidebarNavItemBase } from './SidebarNavItemBase'
import type { SidebarNavItemBaseProps } from './SidebarNavItemBase'
import { SidebarMenuButton } from '@/shared/ui/sidebar'
import { DEFAULT_NAV_ITEM_CLASS_NAME } from './constants'
import { cn } from '@/shared/lib/utils'
import type { NavigationSidebarLinkItem } from '../../model/navItems'

type SidebarNavLinkProps = SidebarNavItemBaseProps & {
  to: NavigationSidebarLinkItem['to']
  onClick?: () => void
}

const COMPACT_NAV_ITEM_CLASS_NAME = 'w-12 justify-center gap-0 px-0'

export function SidebarNavLink(props: SidebarNavLinkProps) {
  const { to, label, icon, isActive, isCompact, onClick } = props

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        size="lg"
        isActive={isActive}
        className={cn(
          DEFAULT_NAV_ITEM_CLASS_NAME,
          isCompact && COMPACT_NAV_ITEM_CLASS_NAME
        )}
      >
        <Link to={to} onClick={onClick}>
          <SidebarNavItemBase
            label={label}
            icon={icon}
            isActive={isActive}
            isCompact={isCompact}
          />
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
