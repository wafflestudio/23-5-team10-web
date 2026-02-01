import { useState } from 'react'
import { Heart, MessageCircle, Send, Bookmark, Smile } from 'lucide-react'
import { useAuthStore } from '@/shared/auth/authStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar.tsx'

interface PostActionSectionProps {
  likeCount: number
  createdAt: string
  isLiked: boolean
  isBookmarked: boolean
  onLikeClick: () => void
  onBookmarkClick: () => void
  onCommentSubmit: (content: string) => void
}

export default function PostActionSection({
  likeCount,
  createdAt,
  isLiked,
  isBookmarked,
  onLikeClick,
  onBookmarkClick,
  onCommentSubmit,
}: PostActionSectionProps) {
  const [comment, setComment] = useState('')
  const { user } = useAuthStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    onCommentSubmit(comment)
    setComment('')
  }

  return (
    <div className="flex flex-col border-t border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-4">
          <button
            onClick={onLikeClick}
            className="transition-opacity hover:opacity-60"
          >
            <Heart
              className={`h-6 w-6 ${isLiked ? 'fill-[#ED4956] text-[#ED4956]' : 'text-black'}`}
            />
          </button>
          <button className="transition-opacity hover:opacity-60">
            <MessageCircle className="h-6 w-6 text-black" />
          </button>
          <button className="transition-opacity hover:opacity-60">
            <Send className="h-6 w-6 text-black" />
          </button>
        </div>
        <button
          onClick={onBookmarkClick}
          className="transition-opacity hover:opacity-60"
        >
          <Bookmark
            className={`h-6 w-6 ${isBookmarked ? 'fill-black text-black' : 'text-black'}`}
          />
        </button>
      </div>

      <div className="px-4 pb-2">
        <div className="mb-1 text-sm font-bold text-black">
          좋아요 {likeCount.toLocaleString()}개
        </div>
        <div className="text-[10px] text-gray-500 uppercase">{createdAt}</div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-2 flex items-center border-t border-gray-100 px-4 py-3"
      >
        <div className="mr-3 flex items-center gap-3">
          <button type="button" className="transition-opacity hover:opacity-60">
            <Smile className="h-6 w-6 text-black" />
          </button>
          {user && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.profileImageUrl} alt={user.nickname} />
              <AvatarFallback>{user.nickname[0]}</AvatarFallback>
            </Avatar>
          )}
        </div>
        <input
          type="text"
          placeholder="댓글 달기..."
          className="flex-1 text-sm outline-none placeholder:text-gray-500"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type="submit"
          disabled={!comment.trim()}
          className={`ml-2 text-sm font-bold transition-opacity ${
            comment.trim()
              ? 'cursor-pointer text-[#0095F6]'
              : 'cursor-default text-[#0095F6]/50'
          }`}
        >
          게시
        </button>
      </form>
    </div>
  )
}
