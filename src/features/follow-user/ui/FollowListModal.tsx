import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog'
import { FollowListItem } from './FollowListItem'
import { Input } from '@/shared/ui/input'
import { type FollowUser } from '@/mocks/types/follow'

export type FollowListType = 'followers' | 'following'

type FollowListModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: FollowListType | null
}

export function FollowListModal({
  open,
  onOpenChange,
  type,
}: FollowListModalProps) {
  const title = type === 'followers' ? '팔로워' : '팔로잉'

  const users: FollowUser[] = [
    {
      userId: 5,
      nickname: 'celebrity',
      profileImageUrl: 'https://picsum.photos/200/200',
      isFollowing: true,
    },
    {
      userId: 6,
      nickname: 'user',
      profileImageUrl: 'https://picsum.photos/200/200',
      isFollowing: true,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-none bg-white">
        <DialogTitle className="text-center text-base font-semibold">
          {title}
        </DialogTitle>

        <Input
          placeholder="검색"
          className="w-full border-none bg-gray-100 focus-visible:ring-0"
        ></Input>

        <div className="mt-4 max-h-[400px] overflow-y-auto">
          {users.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              {type === 'followers'
                ? '팔로워가 없습니다.'
                : '팔로잉한 사용자가 없습니다.'}
            </div>
          ) : (
            <ul className="space-y-1">
              {users.map((user) => (
                <FollowListItem key={user.userId} user={user} type={type} />
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
