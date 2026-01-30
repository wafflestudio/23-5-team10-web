import { cn } from '@/shared/lib/utils'
import type { RefObject } from 'react'
import { useCallback, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Input } from '@/shared/ui/input'
import { useDebounce } from '@/shared/lib/hooks/useDebounce'
import type { SearchUser } from '@/entities/user/model/types'
import { useSearchUser } from '@/entities/user/model/hooks/useSearchUser'
import {
  useRecentSearchQuery,
  useAddRecentSearchMutation,
  useDeleteRecentSearchMutation,
} from '@/entities/search'
import { useAnchorPosition } from '../hooks/useAnchorPosition'
import { useClickOutside } from '../hooks/useClickOutside'
import { SearchResultList } from './SearchResultList'
import { RecentSearchList } from './RecentSearchList'
import { ClearSearchHistoryDialog } from './ClearSearchHistoryDialog'

type SearchDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  anchorRef?: RefObject<HTMLElement | null>
}

export function SearchDrawer({
  open,
  onOpenChange,
  anchorRef,
}: SearchDrawerProps) {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const drawerRef = useRef<HTMLElement | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const { data: searchedUsers = [], isFetching: isSearching } =
    useSearchUser(debouncedSearchTerm)
  const { data: recentSearchedUsers = [] } = useRecentSearchQuery()
  const addRecentSearch = useAddRecentSearchMutation()
  const deleteRecentSearch = useDeleteRecentSearchMutation()

  const close = useCallback(() => {
    setSearchTerm('')
    onOpenChange(false)
  }, [onOpenChange])

  const anchoredStyle = useAnchorPosition(anchorRef, open)

  useClickOutside({
    enabled: open,
    containerRef,
    drawerRef,
    anchorRef,
    onClickOutside: close,
  })

  const handleClickSearchResult = useCallback(
    (user: SearchUser) => {
      addRecentSearch.mutate({ toUserId: user.userId })
      close()
      navigate({
        to: '/$userId',
        params: { userId: String(user.userId) },
      })
    },
    [addRecentSearch, close, navigate]
  )

  const handleClickRecentSearch = useCallback(
    (userId: number) => {
      close()
      navigate({ to: '/$userId', params: { userId: String(userId) } })
    },
    [close, navigate]
  )

  const handleRemoveRecentSearch = useCallback(
    (userId: number) => {
      deleteRecentSearch.mutate({ toUserId: userId })
    },
    [deleteRecentSearch]
  )

  const isSearchMode = debouncedSearchTerm.length > 0

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          'fixed inset-y-0 right-0 z-40 overflow-hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        style={anchoredStyle}
      >
        <aside
          ref={drawerRef}
          className={cn(
            'h-full w-[24rem] rounded-r-2xl bg-white transition-transform duration-300 ease-out',
            open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col gap-6 p-6">
            <h2 className="text-2xl font-bold">검색</h2>
            <Input
              className="rounded-lg border-none bg-gray-100 focus-visible:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색"
            />
            {isSearchMode ? (
              <SearchResultList
                users={searchedUsers}
                isLoading={isSearching}
                onClickUser={handleClickSearchResult}
              />
            ) : (
              <RecentSearchList
                items={recentSearchedUsers}
                onClickItem={handleClickRecentSearch}
                onRemoveItem={handleRemoveRecentSearch}
                onClearAll={() => setClearDialogOpen(true)}
              />
            )}
          </div>
        </aside>
      </div>
      <ClearSearchHistoryDialog
        open={clearDialogOpen}
        onOpenChange={setClearDialogOpen}
        onClear={() => {
          setClearDialogOpen(false)
        }}
      />
    </>
  )
}
