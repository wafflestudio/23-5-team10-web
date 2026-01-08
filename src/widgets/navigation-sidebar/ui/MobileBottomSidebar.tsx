import { NAV_ITEMS } from '../model/navItems'
import { useMatchRoute } from '@tanstack/react-router'
import { SidebarNavButton } from './SidebarNavItem/SidebarNavButton'
import { SidebarNavLink } from './SidebarNavItem/SidebarNavLink'

export function MobileBottomNavigation() {
  const matchRoute = useMatchRoute()

  return (
    <nav className="bg-background fixed inset-x-0 bottom-0 z-50 border-t border-gray-300">
      <ul className="flex justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.to &&
            Boolean(
              matchRoute({
                to: item.to,
              })
            )

          return item.to ? (
            <SidebarNavLink
              key={item.label}
              {...item}
              isActive={isActive}
              to={item.to}
            />
          ) : (
            <SidebarNavButton
              key={item.label}
              {...item}
              isActive={isActive}
              onClick={() => {}}
            />
          )
        })}
      </ul>
    </nav>
  )
}
