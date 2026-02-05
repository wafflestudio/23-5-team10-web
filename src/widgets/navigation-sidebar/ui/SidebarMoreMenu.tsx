import { Menu } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { SidebarNavItemBase } from './SidebarNavItem/SidebarNavItemBase'
import { DEFAULT_NAV_ITEM_CLASS_NAME } from './SidebarNavItem/constants'
import { useAuth } from '@/shared/auth/useAuth'

export function SidebarMoreMenu() {
  const { logout } = useAuth()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={DEFAULT_NAV_ITEM_CLASS_NAME}
            >
              <SidebarNavItemBase label="더보기" icon={Menu} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            className="w-[250px] rounded-2xl border-none bg-white p-2"
          >
            <DropdownMenuItem
              asChild
              className="h-12 cursor-pointer px-4 text-base"
            >
              <Link to="/accounts/edit">프로필 편집</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border-t border-gray-200" />
            <DropdownMenuItem
              className="h-12 cursor-pointer px-4 text-base"
              onClick={logout}
            >
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
