import { SidebarMenuButton, SidebarMenuItem } from '@/shared/ui/sidebar'
import { SidebarNavItemBase } from './SidebarNavItemBase'
import type { SidebarNavItemBaseProps } from './SidebarNavItemBase'
import { DEFAULT_NAV_ITEM_CLASS_NAME } from './constants'

type SidebarNavButtonProps = SidebarNavItemBaseProps & {
  onClick: () => void
}

export function SidebarNavButton({ onClick, ...rest }: SidebarNavButtonProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        size="lg"
        isActive={rest.isActive}
        className={DEFAULT_NAV_ITEM_CLASS_NAME}
        onClick={onClick}
      >
        <SidebarNavItemBase {...rest} />
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
