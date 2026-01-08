import type { FileRouteTypes } from '@/routeTree.gen'
import { Compass, House, Plus, Search, UserCircle } from 'lucide-react'
import type { ComponentType } from 'react'

type NavigationSidebarItem = {
  label: string
  icon: ComponentType<{ className?: string }>
  to?: FileRouteTypes['to']
  getParams?: (pathname: string) => Record<string, string | number> | undefined
}

export const NAV_ITEMS: NavigationSidebarItem[] = [
  {
    label: '홈',
    icon: House,
    to: '/',
  },
  {
    label: '검색',
    icon: Search,
  },
  {
    label: '탐색 탭',
    icon: Compass,
    to: '/explore',
  },
  {
    label: '만들기',
    icon: Plus,
  },
  {
    label: '프로필',
    icon: UserCircle,
    to: '/me',
  },
]
