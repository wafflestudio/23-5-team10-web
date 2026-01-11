import { useMatchRoute, useNavigate } from '@tanstack/react-router'
import { useActionState, useCallback } from 'react'

import type { NavigationSidebarItem } from './navItems'
import { MOCK_PROFILE_NAME } from './navItems'

type NavAction =
  | { type: 'search_toggle' }
  | { type: 'search_set'; open: boolean }
  | { type: 'create_open' }
  | { type: 'profile_open' }

type NavUiState = {
  isSearchOpen: boolean
}

const INITIAL_NAV_UI_STATE: NavUiState = { isSearchOpen: false }

function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`)
}

type UseNavControllerArgs = {
  onCreateClick: () => void
}

export function useNavController({ onCreateClick }: UseNavControllerArgs) {
  const matchRoute = useMatchRoute()
  const navigate = useNavigate()

  const [uiState, dispatchNavAction] = useActionState<NavUiState, NavAction>(
    (prev, action) => {
      switch (action.type) {
        case 'search_toggle':
          return { ...prev, isSearchOpen: !prev.isSearchOpen }
        case 'search_set':
          return { ...prev, isSearchOpen: action.open }
        case 'create_open':
          onCreateClick()
          return prev
        case 'profile_open':
          navigate({
            to: '/$profile_name',
            params: { profile_name: MOCK_PROFILE_NAME },
          })
          return prev
        default:
          return assertNever(action)
      }
    },
    INITIAL_NAV_UI_STATE
  )

  const isMyProfileRouteActive =
    Boolean(
      matchRoute({
        to: '/$profile_name',
        params: { profile_name: MOCK_PROFILE_NAME },
      })
    ) ||
    Boolean(
      matchRoute({
        to: '/$profile_name/saved',
        params: { profile_name: MOCK_PROFILE_NAME },
      })
    )

  const getIsItemActive = useCallback(
    (item: NavigationSidebarItem) => {
      if (item.type === 'link') {
        return Boolean(matchRoute({ to: item.to }))
      }

      switch (item.action) {
        case 'search':
          return uiState.isSearchOpen
        case 'profile':
          return isMyProfileRouteActive
        case 'create':
          return false
        default:
          return assertNever(item.action)
      }
    },
    [isMyProfileRouteActive, matchRoute, uiState.isSearchOpen]
  )

  const handleItemClick = useCallback(
    (item: NavigationSidebarItem) => {
      if (item.type === 'link') return

      switch (item.action) {
        case 'search':
          dispatchNavAction({ type: 'search_toggle' })
          return
        case 'create':
          dispatchNavAction({ type: 'create_open' })
          return
        case 'profile':
          dispatchNavAction({ type: 'profile_open' })
          return
        default:
          return assertNever(item.action)
      }
    },
    [dispatchNavAction]
  )

  const setSearchOpen = useCallback(
    (open: boolean) => dispatchNavAction({ type: 'search_set', open }),
    [dispatchNavAction]
  )

  return {
    uiState,
    setSearchOpen,
    getIsItemActive,
    handleItemClick,
  }
}
