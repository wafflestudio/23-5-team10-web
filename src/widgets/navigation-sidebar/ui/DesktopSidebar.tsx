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
import { useRef } from 'react'
import { SearchDrawer } from '@/features/search/ui/SearchDrawer'

interface NavigationSidebarProps {
  onCreateClick: () => void
}

export function NavigationSidebar({ onCreateClick }: NavigationSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  const { uiState, setSearchOpen, getIsItemActive, handleItemClick } =
    useNavController({ onCreateClick })

  return (
    <>
      <SearchDrawer
        open={uiState.isSearchOpen}
        onOpenChange={setSearchOpen}
        anchorRef={sidebarRef}
      />

      <Sidebar
        ref={sidebarRef}
        collapsible="icon"
        className="border-r border-gray-300"
      >
        <SidebarHeader className="pt-8 pb-4">
          <div className="flex items-center justify-center">
            <img
              src={instagramLogo}
              alt="Instagram"
              className="h-12 group-data-[collapsible=icon]:size-10"
            />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu className="gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = getIsItemActive(item)

              if (item.type === 'link') {
                return (
                  <SidebarNavLink
                    key={item.label}
                    {...item}
                    isActive={isActive}
                  />
                )
              }

              return (
                <SidebarNavButton
                  key={item.label}
                  {...item}
                  isActive={isActive}
                  onClick={() => handleItemClick(item)}
                />
              )
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </>
  )
}
