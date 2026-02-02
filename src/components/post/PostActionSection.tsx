import { useState, useEffect, useRef } from 'react'
import { Heart, MessageCircle, Bookmark, Smile, X } from 'lucide-react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
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

const POPULAR_EMOJIS = [
  '😂',
  '😮',
  '😍',
  '😟',
  '👏',
  '🔥',
  '🎉',
  '💯',
  '❤️',
  '🤣',
  '🥰',
  '😘',
  '😭',
  '😊',
]
const ACTIVITY_EMOJIS = [
  '🕴️',
  '🧗',
  '🧗‍♂️',
  '🧗‍♀️',
  '🏇',
  '🎿',
  '🏂',
  '🏌️',
  '🏌️‍♂️',
  '🏌️‍♀️',
  '🏄',
  '🏄‍♂️',
  '🏄‍♀️',
  '🚣',
  '🚣‍♂️',
  '🚣‍♀️',
  '🏊',
  '🏊‍♂️',
  '🏊‍♀️',
  '⛹️',
  '⛹️‍♂️',
  '⛹️‍♀️',
  '🏋️',
  '🏋️‍♂️',
  '🏋️‍♀️',
  '🚴',
  '🚴‍♂️',
  '🚴‍♀️',
]

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const smileButtonRef = useRef<HTMLButtonElement>(null)

  const heartControls = useAnimation()
  const bookmarkControls = useAnimation()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        smileButtonRef.current &&
        !smileButtonRef.current.contains(e.target as Node)
      ) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const handleEmojiClick = (emoji: string) => {
    const input = inputRef.current
    if (!input) return

    const start = input.selectionStart ?? comment.length
    const end = input.selectionEnd ?? comment.length

    const newComment =
      comment.substring(0, start) + emoji + comment.substring(end)
    setComment(newComment)

    setTimeout(() => {
      input.focus()
      input.setSelectionRange(start + emoji.length, start + emoji.length)
    }, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    onCommentSubmit(comment)
    setComment('')
    setShowEmojiPicker(false)
  }

  const handleCancel = () => {
    setComment('')
    onCancelEdit?.()
  }

  const toggleEmojiPicker = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowEmojiPicker((prev) => !prev)
  }

  const isEditMode = editValue !== undefined
  const isUnchanged = isEditMode && comment === editValue
  const isSubmitDisabled = !comment.trim() || isUnchanged

  const iconTransition: Transition = {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.3,
  }

  const iconHoverScale = { scale: 1.25 }
  const iconTapScale = { scale: 1 }

  return (
    <div className="relative flex flex-col border-t border-gray-200 bg-white">
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
        className="relative flex items-center border-t border-gray-100 px-4 py-3"
      >
        <div className="mr-3 flex items-center">
          <motion.button
            ref={smileButtonRef}
            type="button"
            whileHover={iconHoverScale}
            whileTap={iconTapScale}
            transition={iconTransition}
            onClick={toggleEmojiPicker}
          >
            <Smile
              className={`h-6 w-6 ${showEmojiPicker ? 'text-[#0095F6]' : 'text-black'}`}
            />
          </motion.button>

          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                ref={pickerRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-4 z-50 mb-2 w-[315px] rounded-xl border border-gray-200 bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="max-h-[320px] overflow-y-auto p-4 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#dbdbdb]">
                  <section className="mb-4">
                    <h3 className="mb-3 text-[13px] font-bold text-gray-400">
                      최고 인기 이모티콘
                    </h3>
                    <div className="grid grid-cols-7 gap-2">
                      {POPULAR_EMOJIS.map((emoji, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleEmojiClick(emoji)}
                          className="flex h-9 items-center justify-center text-2xl transition-transform hover:scale-125 active:scale-95"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="mb-3 text-[13px] font-bold text-gray-400">
                      활동
                    </h3>
                    <div className="grid grid-cols-7 gap-2">
                      {ACTIVITY_EMOJIS.map((emoji, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleEmojiClick(emoji)}
                          className="flex h-9 items-center justify-center text-2xl transition-transform hover:scale-125 active:scale-95"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
