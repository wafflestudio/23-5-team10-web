import type { FileRouteTypes } from '@/routeTree.gen'
import { Compass, House, Plus, Search, UserCircle } from 'lucide-react'
import type { ComponentType } from 'react'

type NavigationSidebarItem = {
  type: 'link' | 'button'
  label: string
  icon: ComponentType<{ className?: string }>
  to?: FileRouteTypes['to']
  action?: 'search' | 'create'
}

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
    to: '/me',
    type: 'link',
  },
]
