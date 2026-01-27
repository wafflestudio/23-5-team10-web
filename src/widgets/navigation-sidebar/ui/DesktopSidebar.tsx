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
  onCreatePostClick: () => void
  onCreateStoryClick: () => void
}

export function NavigationSidebar({
  onCreatePostClick,
  onCreateStoryClick,
}: NavigationSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  const {
    uiState,
    setSearchOpen,
    getIsItemActive,
    handleItemClick,
    closeSearchIfOpen,
  } = useNavController({ onCreatePostClick, onCreateStoryClick })

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
        <SidebarHeader className="px-4 pt-8 pb-4">
          <div className="flex items-center justify-center">
            <img
              src={instagramLogo}
              alt="Instagram"
              className="h-12 group-data-[collapsible=icon]:size-12"
            />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu className="gap-1 px-4">
            {NAV_ITEMS.map((item) => {
              const isActive = getIsItemActive(item)

              if (item.type === 'link') {
                return (
                  <SidebarNavLink
                    key={item.label}
                    {...item}
                    isActive={isActive}
                    onClick={closeSearchIfOpen}
                  />
                )
              }

              return (
                <SidebarNavButton
                  key={item.label}
                  {...item}
                  isActive={isActive}
                  onClick={() => {
                    if (item.action === 'profile') {
                      closeSearchIfOpen()
                    }
                    handleItemClick(item)
                  }}
                />
              )
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </>
  )
}
