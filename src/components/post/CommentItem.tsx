import { useMemo, useState } from 'react'
import { Heart, MoreHorizontal } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { formatRelativeTime } from '../../utils/date.ts'
import CommentMenuModal from './CommentMenuModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar.tsx'
import { useDeleteCommentMutation } from '@/entities/post/model/hooks/useDeleteCommentMutation'

interface Comment {
  id: number
  postId: number
  userId: number
  nickname: string
  content: string
  profileImageUrl: string | null
  createdAt: string
  updatedAt: string
  parentId: number | null
  likeCount: number
  isLiked: boolean
  likedUserIds: number[]
}

interface CommentItemProps {
  comment: Comment
  isLiked: boolean
  onDoubleClick: (id: number) => void
  onHeartClick: (id: number, e: React.MouseEvent) => void
  onDeleteSuccess?: (commentId: number) => void
  onEditClick: (comment: Comment) => void
}

export default function CommentItem({
  comment,
  isLiked,
  onDoubleClick,
  onHeartClick,
  onDeleteSuccess,
  onEditClick,
}: CommentItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const deleteMutation = useDeleteCommentMutation(comment.postId)

  const isEdited = comment.createdAt !== comment.updatedAt

  const timeDisplay = useMemo(
    () => formatRelativeTime(comment.createdAt),
    [comment.createdAt]
  )

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(true)
  }

  const handleDelete = () => {
    deleteMutation.mutate(comment.id, {
      onSuccess: () => {
        if (onDeleteSuccess) {
          onDeleteSuccess(comment.id)
        }
      },
    })
    setIsMenuOpen(false)
  }

  const handleHide = () => {
    if (onDeleteSuccess) {
      onDeleteSuccess(comment.id)
    }
    setIsMenuOpen(false)
  }

  const handleEdit = () => {
    onEditClick(comment)
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
          <Link
            to="/$userId"
            params={{ userId: String(comment.userId) }}
            className="mt-0.5 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={comment.profileImageUrl ?? undefined}
                alt={comment.nickname}
                className="object-cover"
              />
              <AvatarFallback>{comment.nickname[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="text-sm leading-tight">
            <Link
              to="/$userId"
              params={{ userId: String(comment.userId) }}
              className="mr-2 font-semibold text-black transition-opacity hover:opacity-60"
              onClick={(e) => e.stopPropagation()}
            >
              {comment.nickname}
            </Link>
            <span className="break-all text-black">{comment.content}</span>

            <div className="mt-[7px] flex h-4 items-center gap-3 text-xs font-semibold text-gray-500">
              <span className="font-normal">
                {timeDisplay}
                {isEdited && ' (수정됨)'}
              </span>
              {displayLikeCount > 0 && (
                <span className="font-semibold text-gray-500">
                  좋아요 {displayLikeCount}개
                </span>
              )}
              <button
                className="p-1 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={handleMenuClick}
              >
                <MoreHorizontal className="h-4 w-4 scale-x-[-1] text-gray-500" />
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
          onEdit={handleEdit}
          onHide={handleHide}
          authorId={comment.userId}
          nickname={comment.nickname}
        />
      )}
    </>
  )
}
