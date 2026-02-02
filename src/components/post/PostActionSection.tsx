import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Bookmark, Smile, X } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'
import type { Transition } from 'framer-motion'

interface PostActionSectionProps {
  likeCount: number
  createdAt: string
  isLiked: boolean
  isBookmarked: boolean
  onLikeClick: () => void
  onBookmarkClick: () => void
  onCommentSubmit: (content: string) => void
  onCommentIconClick: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
  editValue?: string
  onCancelEdit?: () => void
}

export default function PostActionSection({
  likeCount,
  createdAt,
  isLiked,
  isBookmarked,
  onLikeClick,
  onBookmarkClick,
  onCommentSubmit,
  onCommentIconClick,
  inputRef,
  editValue,
  onCancelEdit,
}: PostActionSectionProps) {
  const [comment, setComment] = useState(editValue ?? '')
  const heartControls = useAnimation()
  const bookmarkControls = useAnimation()

  useEffect(() => {
    if (isLiked) {
      heartControls.start({
        scale: [1, 1.3, 1],
        transition: { duration: 0.3 },
      })
    }
  }, [isLiked, heartControls])

  useEffect(() => {
    if (isBookmarked) {
      bookmarkControls.start({
        scale: [1, 1.3, 1],
        transition: { duration: 0.3 },
      })
    }
  }, [isBookmarked, bookmarkControls])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    onCommentSubmit(comment)
    setComment('')
  }

  const handleCancel = () => {
    setComment('')
    onCancelEdit?.()
  }

  const isEditMode = editValue !== undefined
  const isUnchanged = isEditMode && comment === editValue
  const isSubmitDisabled = !comment.trim() || isUnchanged

  const iconTransition: Transition = {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.3,
  }

  const iconHoverScale = {
    scale: 1.25,
  }

  const iconTapScale = {
    scale: 1,
  }

  return (
    <div className="flex flex-col border-t border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={iconHoverScale}
            whileTap={iconTapScale}
            transition={iconTransition}
            onClick={onLikeClick}
            animate={heartControls}
          >
            <Heart
              className={`h-6 w-6 ${isLiked ? 'fill-[#ED4956] text-[#ED4956]' : 'text-black'}`}
            />
          </motion.button>
          <motion.button
            whileHover={iconHoverScale}
            whileTap={iconTapScale}
            transition={iconTransition}
            onClick={onCommentIconClick}
          >
            <MessageCircle className="h-6 w-6 text-black" />
          </motion.button>
        </div>
        <motion.button
          whileHover={iconHoverScale}
          whileTap={iconTapScale}
          transition={iconTransition}
          onClick={onBookmarkClick}
          animate={bookmarkControls}
        >
          <Bookmark
            className={`h-6 w-6 ${isBookmarked ? 'fill-black text-black' : 'text-black'}`}
          />
        </motion.button>
      </div>

      <div className="px-4 pb-2">
        <div className="mb-1 text-sm text-black">
          {likeCount > 0 ? (
            <span className="font-bold">
              좋아요 {likeCount.toLocaleString()}개
            </span>
          ) : (
            <span>
              가장 먼저 <span className="font-bold">좋아요</span>를 눌러보세요
            </span>
          )}
        </div>
        <div className="text-[10px] text-gray-500 uppercase">{createdAt}</div>
      </div>

      {isEditMode && (
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-2">
          <span className="text-xs font-medium text-gray-500">
            댓글 수정 중...
          </span>
          <button
            onClick={handleCancel}
            className="p-1 transition-opacity hover:opacity-60"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-center border-t border-gray-100 px-4 py-3"
      >
        <div className="mr-3 flex items-center">
          <motion.button
            type="button"
            whileHover={iconHoverScale}
            whileTap={iconTapScale}
            transition={iconTransition}
          >
            <Smile className="h-6 w-6 text-black" />
          </motion.button>
        </div>
        <input
          type="text"
          ref={inputRef}
          placeholder="댓글 달기..."
          className="flex-1 text-sm outline-none placeholder:text-gray-500"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`ml-2 text-sm font-bold transition-opacity ${
            isSubmitDisabled
              ? 'cursor-default text-[#0095F6]/50'
              : 'cursor-pointer text-[#0095F6]'
          }`}
        >
          {isEditMode ? '수정' : '게시'}
        </button>
      </form>
    </div>
  )
}
