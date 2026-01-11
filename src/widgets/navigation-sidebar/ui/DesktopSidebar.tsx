import instagramLogo from '@/assets/instagram-logo.svg'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
} from '@/shared/ui/sidebar'
import { NAV_ITEMS } from '../model/navItems'
import { useNavController } from '../model/useNavController'
import { SidebarNavLink } from './SidebarNavItem/SidebarNavLink'
import { SidebarNavButton } from './SidebarNavItem/SidebarNavButton'
import { cn } from '@/shared/lib/utils'
import { useRef } from 'react'
import { SearchDrawer } from '@/features/search/ui/SearchDrawer'

interface NavigationSidebarProps {
  onCreateClick: () => void
}

export function NavigationSidebar({ onCreateClick }: NavigationSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement | null>(null)
  const { uiState, setSearchOpen, getIsItemActive, handleItemClick } =
    useNavController({ onCreateClick })

  const isCompact = uiState.isSearchOpen

  const baseSidebarClass = 'border-r border-gray-300 h-full'
  const fullSidebarClass = 'w-64 px-4'
  const compactSidebarClass = 'w-auto px-2'

  return (
    <>
      <SearchDrawer
        open={uiState.isSearchOpen}
        onOpenChange={setSearchOpen}
        anchorRef={sidebarRef}
      />
      <div className="h-full">
        <Sidebar
          ref={sidebarRef}
          className={cn(
            baseSidebarClass,
            fullSidebarClass,
            isCompact && compactSidebarClass,
            'max-xl:w-auto max-xl:px-2'
          )}
        >
          <SidebarHeader
            className={cn('pt-8 pb-4', isCompact && 'max-xl:px-0')}
          >
            <div
              className={cn(
                'flex items-center',
                isCompact && 'justify-center',
                'max-xl:justify-center'
              )}
            >
              <img
                src={instagramLogo}
                alt="Instagram"
                className={cn('h-12', isCompact && 'size-10', 'max-xl:size-10')}
              />
            </div>
          </SidebarHeader>

          <SidebarContent className={cn(isCompact && 'px-4', 'max-xl:px-4')}>
            <SidebarMenu className="gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = getIsItemActive(item)

                if (item.type === 'link') {
                  return (
                    <SidebarNavLink
                      key={item.label}
                      label={item.label}
                      icon={item.icon}
                      isActive={isActive}
                      isCompact={isCompact}
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
                    isCompact={isCompact}
                    onClick={handleClick}
                  />
                )
              })}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </div>
    </>
  )
}
