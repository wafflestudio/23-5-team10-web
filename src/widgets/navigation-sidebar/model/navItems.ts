import { Compass, House, Plus, Search, UserCircle } from 'lucide-react'
import type { ComponentType } from 'react'

type BaseNavigationSidebarItem = {
  label: string
  icon: ComponentType<{ className?: string }>
}

export const MOCK_PROFILE_NAME = 'me'

export type NavigationSidebarLinkTo = '/' | '/explore'

export type NavigationSidebarLinkItem = BaseNavigationSidebarItem & {
  type: 'link'
  to: NavigationSidebarLinkTo
}

export type NavigationSidebarButtonItem = BaseNavigationSidebarItem & {
  type: 'button'
  action: 'search' | 'create' | 'profile'
}

export type NavigationSidebarItem =
  | NavigationSidebarLinkItem
  | NavigationSidebarButtonItem

export const NAV_ITEMS: NavigationSidebarItem[] = [
  {
    label: '홈',
    icon: House,
    to: '/',
    type: 'link',
  },
  {
    label: '검색',
    icon: Search,
    type: 'button',
    action: 'search',
  },
  {
    label: '탐색 탭',
    icon: Compass,
    to: '/explore',
    type: 'link',
  },
  {
    label: '만들기',
    icon: Plus,
    type: 'button',
    action: 'create',
  },
  {
    label: '프로필',
    icon: UserCircle,
    type: 'button',
    action: 'profile',
  },
]
