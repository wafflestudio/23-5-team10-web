import { useMemo } from 'react'
import { Heart, MoreHorizontal } from 'lucide-react'
import { formatRelativeTime } from '../../utils/date.ts'

interface Comment {
  id: number
  nickname: string
  content: string
  profileImageUrl: string
  createdAt: string
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
  const timeDisplay = useMemo(
    () => formatRelativeTime(comment.createdAt),
    [comment.createdAt]
  )

  return (
    <div
      className="group relative flex cursor-pointer items-start justify-between gap-3 px-1 py-1.5 select-none"
      onDoubleClick={() => onDoubleClick(comment.id)}
    >
      <div className="flex flex-1 gap-3">
        <img
          src={comment.profileImageUrl}
          className={`${isReply ? 'h-6 w-6' : 'h-8 w-8'} shrink-0 rounded-full object-cover`}
          alt=""
        />
        <div className="text-sm">
          <span className="mr-2 font-semibold text-black">
            {comment.nickname}
          </span>
          <span className="break-all text-black">{comment.content}</span>
          <div className="mt-1 flex h-4 items-center gap-3 text-xs font-semibold text-gray-500">
            <span>{timeDisplay}</span>
            <button
              className="hover:text-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              좋아요
            </button>
            <button
              className="hover:text-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              답글 달기
            </button>
            <button
              className="p-1 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={(e) => onHeartClick(comment.id, e)}
        className="mt-1.5 flex-shrink-0"
      >
        <Heart
          className={`h-3 w-3 transition-colors ${
            isLiked
              ? 'fill-red-500 text-red-500'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        />
      </button>
    </div>
  )
}
