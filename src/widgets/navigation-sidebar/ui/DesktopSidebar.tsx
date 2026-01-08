import instagramLogo from '@/assets/instagram-logo.svg'
import { useMatchRoute } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
} from '@/shared/ui/sidebar'
import { NAV_ITEMS } from '../model/navItems'
import { SidebarNavLink } from './SidebarNavItem/SidebarNavLink'
import { SidebarNavButton } from './SidebarNavItem/SidebarNavButton'

export function NavigationSidebar() {
  const matchRoute = useMatchRoute()

  return (
    <div className="h-full">
      <Sidebar className="w-64 border-r border-gray-300 px-4 max-xl:w-16 max-xl:px-2">
        <SidebarHeader className="pt-8 pb-4 max-xl:px-0">
          <div className="flex items-center max-xl:justify-center">
            <img src={instagramLogo} alt="Instagram" className="h-12" />
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 max-xl:px-0">
          <SidebarMenu className="gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = Boolean(
                item.to &&
                matchRoute({
                  to: item.to,
                })
              )
              return item.to ? (
                <SidebarNavLink
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  isActive={isActive}
                  to={item.to}
                />
              ) : (
                <SidebarNavButton
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  isActive={isActive}
                  onClick={() => {}}
                />
              )
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </div>
  )
}
