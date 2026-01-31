import { useMatchRoute, useNavigate } from '@tanstack/react-router'
import { useActionState, useCallback } from 'react'

import type { NavigationSidebarItem } from './navItems'
import { MOCK_USER_ID } from './navItems'
import { useEffect } from 'react'
import { useSidebar } from '@/shared/ui/sidebar'
import { useXlBreakpoint } from '@/shared/lib/hooks/useXlBreakpoint'

type NavAction =
  | { type: 'search_toggle' }
  | { type: 'search_set'; open: boolean }
  | { type: 'create_post_open' }
  | { type: 'create_story_open' }
  | { type: 'profile_open' }

type NavUiState = {
  isSearchOpen: boolean
}

const INITIAL_NAV_UI_STATE: NavUiState = { isSearchOpen: false }

function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`)
}

type UseNavControllerArgs = {
  onCreatePostClick: () => void
  onCreateStoryClick: () => void
}

export function useNavController({
  onCreatePostClick,
  onCreateStoryClick,
}: UseNavControllerArgs) {
  const matchRoute = useMatchRoute()
  const navigate = useNavigate()
  const isBelowXl = useXlBreakpoint()
  const { setOpen, setLockGapWidth } = useSidebar()

  const [uiState, dispatchNavAction] = useActionState<NavUiState, NavAction>(
    (prev, action) => {
      switch (action.type) {
        case 'search_toggle':
          return { ...prev, isSearchOpen: !prev.isSearchOpen }
        case 'search_set':
          return { ...prev, isSearchOpen: action.open }
        case 'create_post_open':
          onCreatePostClick()
          return prev
        case 'create_story_open':
          onCreateStoryClick()
          return prev
        case 'profile_open':
          navigate({
            to: '/$userId',
            params: { userId: String(MOCK_USER_ID) },
          })
          return prev
        default:
          return assertNever(action)
      }
    },
    INITIAL_NAV_UI_STATE
  )

  useEffect(() => {
    if (uiState.isSearchOpen) {
      setOpen(false)
      return
    }

    if (isBelowXl) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [uiState.isSearchOpen, isBelowXl, setOpen])

  useEffect(() => {
    setLockGapWidth(uiState.isSearchOpen)
  }, [uiState.isSearchOpen, setLockGapWidth])

  const isMyProfileRouteActive =
    Boolean(
      matchRoute({
        to: '/$userId',
        params: { userId: String(MOCK_USER_ID) },
      })
    ) ||
    Boolean(
      matchRoute({
        to: '/$userId/saved',
        params: { userId: String(MOCK_USER_ID) },
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
        case 'createPost':
        case 'createStory':
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
        case 'createPost':
          dispatchNavAction({ type: 'create_post_open' })
          return
        case 'createStory':
          dispatchNavAction({ type: 'create_story_open' })
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

  const closeSearchIfOpen = useCallback(() => {
    if (uiState.isSearchOpen) {
      dispatchNavAction({ type: 'search_set', open: false })
    }
  }, [dispatchNavAction, uiState.isSearchOpen])

  const setSearchOpen = useCallback(
    (open: boolean) => dispatchNavAction({ type: 'search_set', open }),
    [dispatchNavAction]
  )

  return {
    uiState,
    setSearchOpen,
    getIsItemActive,
    handleItemClick,
    closeSearchIfOpen,
  }
}
