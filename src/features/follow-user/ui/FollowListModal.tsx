import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog'
import { FollowListItem } from './FollowListItem'
import { Input } from '@/shared/ui/input'
import { useFollowers } from '../model/useFollowers'
import { useFollowing } from '../model/useFollowing'

export type FollowListType = 'followers' | 'following'

type FollowListModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: FollowListType | null
  userId: number
}

export function FollowListModal({
  open,
  onOpenChange,
  type,
  userId,
}: FollowListModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const title = type === 'followers' ? '팔로워' : '팔로잉'

  const { data: followers = [], isLoading: isLoadingFollowers } = useFollowers({
    userId,
    enabled: open && type === 'followers',
  })

  const { data: following = [], isLoading: isLoadingFollowing } = useFollowing({
    userId,
    enabled: open && type === 'following',
  })

  const users = type === 'followers' ? followers : following
  const isLoading =
    type === 'followers' ? isLoadingFollowers : isLoadingFollowing

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return users
    return users.filter((user) => user.nickname.toLowerCase().includes(query))
  }, [users, searchQuery])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSearchQuery('')
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-none bg-white">
        <DialogTitle className="text-center text-base font-semibold">
          {title}
        </DialogTitle>

        <Input
          placeholder="검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border-none bg-gray-100 focus-visible:ring-0"
        />

        <div className="mt-4 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-gray-500">
              로딩 중...
            </div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              {type === 'followers'
                ? '팔로워가 없습니다.'
                : '팔로잉한 사용자가 없습니다.'}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              검색 결과가 없습니다.
            </div>
          ) : (
            <ul className="space-y-1">
              {filteredUsers.map((user) => (
                <FollowListItem
                  key={user.userId}
                  user={user}
                  type={type}
                  onNavigate={() => handleOpenChange(false)}
                  profileUserId={userId}
                />
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
