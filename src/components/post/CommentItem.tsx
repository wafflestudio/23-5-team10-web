import { useMemo, useState } from 'react'
import { Heart, MoreHorizontal } from 'lucide-react'
import { formatRelativeTime } from '../../utils/date.ts'
import CommentMenuModal from './CommentMenuModal'

interface Comment {
  id: number
  userId: number
  nickname: string
  content: string
  profileImageUrl: string
  createdAt: string
  likeCount?: number
}

interface CommentItemProps {
  comment: Comment
  isReply?: boolean
  isLiked: boolean
  onDoubleClick: (id: number) => void
  onHeartClick: (id: number, e: React.MouseEvent) => void
}

export default function CommentItem({
  comment,
  isReply = false,
  isLiked,
  onDoubleClick,
  onHeartClick,
}: CommentItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const currentUserId = 999

  const timeDisplay = useMemo(
    () => formatRelativeTime(comment.createdAt),
    [comment.createdAt]
  )

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(true)
  }

  const handleDelete = () => {
    setIsMenuOpen(false)
  }

  const displayLikeCount = comment.likeCount || 0

  return (
    <>
      <div
        className="group relative flex cursor-pointer items-start justify-between gap-3 px-1 py-1.5 select-none"
        onDoubleClick={() => onDoubleClick(comment.id)}
      >
        <div className="flex flex-1 items-start gap-3">
          <img
            src={comment.profileImageUrl}
            className={`${isReply ? 'h-6 w-6' : 'h-8 w-8'} mt-0.5 shrink-0 rounded-full object-cover`}
            alt=""
          />
          <div className="text-sm leading-tight">
            <span className="mr-2 font-semibold text-black">
              {comment.nickname}
            </span>
            <span className="break-all text-black">{comment.content}</span>

            <div className="mt-[7px] flex h-4 items-center gap-3 text-xs font-semibold text-gray-500">
              <span className="font-normal">{timeDisplay}</span>
              {displayLikeCount > 0 && (
                <span className="font-semibold text-gray-500">
                  좋아요 {displayLikeCount}개
                </span>
              )}
              <button
                className="hover:text-gray-900"
                onClick={(e) => e.stopPropagation()}
              >
                답글 달기
              </button>
              <button
                className="p-1 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={handleMenuClick}
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onHeartClick(comment.id, e)
          }}
          className="mt-1.5 flex-shrink-0 p-1"
        >
          <Heart
            className={`h-3 w-3 transition-all ${
              isLiked
                ? 'scale-110 fill-[#ED4956] text-[#ED4956]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          />
        </button>
      </div>

      {isMenuOpen && (
        <CommentMenuModal
          onClose={() => setIsMenuOpen(false)}
          onDelete={handleDelete}
          isMine={comment.userId === currentUserId}
        />
      )}
    </>
  )
}
