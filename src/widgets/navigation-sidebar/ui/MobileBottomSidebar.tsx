import { NAV_ITEMS } from '../model/navItems'
import { SidebarNavButton } from './SidebarNavItem/SidebarNavButton'
import { SidebarNavLink } from './SidebarNavItem/SidebarNavLink'
import { SearchDrawer } from '@/features/search/ui/SearchDrawer'
import { useNavController } from '../model/useNavController'

interface MobileBottomNavigationProps {
  onCreatePostClick: () => void
  onCreateStoryClick: () => void
}

export function MobileBottomNavigation({
  onCreatePostClick,
  onCreateStoryClick,
}: MobileBottomNavigationProps) {
  const { uiState, setSearchOpen, getIsItemActive, handleItemClick } =
    useNavController({ onCreatePostClick, onCreateStoryClick })

  return (
    <>
      <SearchDrawer open={uiState.isSearchOpen} onOpenChange={setSearchOpen} />
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-300 bg-white">
        <ul className="flex justify-around">
          {NAV_ITEMS.map((item) => {
            const isActive = getIsItemActive(item)

            if (item.type === 'link') {
              return (
                <SidebarNavLink
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  isActive={isActive}
                  to={item.to}
                />
              )
            }

            const handleClick = () => handleItemClick(item)

            return (
              <SidebarNavButton
                key={item.label}
                label={item.label}
                icon={item.icon}
                isActive={isActive}
                onClick={handleClick}
              />
            )
          })}
        </ul>
      </nav>
    </>
  )
}
