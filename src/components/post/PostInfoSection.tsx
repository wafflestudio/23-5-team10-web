import {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { PostData } from './PostDetail'
import PostMenuModal from './PostMenuModal'
import CommentItem from './CommentItem'
import PostActionSection from './PostActionSection'
import { formatRelativeTime } from '../../utils/date.ts'
import { instance } from '../../shared/api/ky'

interface Comment {
  id: number
  postId: number
  userId: number
  nickname: string
  profileImageUrl: string
  content: string
  createdAt: string
  updatedAt: string
  parentId: number | null
  likeCount: number
  liked: boolean
  likedUserIds: number[]
}

export interface PostInfoSectionRef {
  handlePostLike: () => Promise<void>
}

interface PostInfoSectionProps {
  data: PostData | null
  onDataChange?: (newData: PostData) => void
}

const PostInfoSection = forwardRef<PostInfoSectionRef, PostInfoSectionProps>(
  ({ data: initialData, onDataChange }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [postData, setPostData] = useState<PostData | null>(initialData)
    const [comments, setComments] = useState<Comment[]>([])
    const [likedComments, setLikedComments] = useState<{
      [key: number]: boolean
    }>({})
    const [hasMore, setHasMore] = useState(true)
    const [editingComment, setEditingComment] = useState<Comment | null>(null)

    const observerTarget = useRef<HTMLDivElement>(null)
    const pageRef = useRef(1)
    const isFetching = useRef(false)
    const commentInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      setPostData(initialData)
    }, [initialData])

    useImperativeHandle(ref, () => ({
      handlePostLike: async () => {
        await handlePostLikeClick()
      },
    }))

    const fetchComments = useCallback(
      async (pageNum: number) => {
        const postId = postData?.id
        if (!postId || isFetching.current) return

        isFetching.current = true
        try {
          const response = await instance
            .get(`api/v1/posts/${postId}/comments`, {
              searchParams: { page: pageNum },
            })
            .json<{ data: Comment[]; success: boolean }>()

          if (response.success && response.data.length > 0) {
            const newComments = response.data

            setLikedComments((prev) => {
              const nextLiked = { ...prev }
              newComments.forEach((c: Comment) => {
                nextLiked[c.id] = c.liked
              })
              return nextLiked
            })

            setComments((prev) => {
              if (pageNum === 1) return newComments
              const existingIds = new Set(prev.map((c) => c.id))
              const filtered = newComments.filter(
                (c: Comment) => !existingIds.has(c.id)
              )
              return [...prev, ...filtered]
            })
            pageRef.current = pageNum
            setHasMore(true)
          } else {
            setHasMore(false)
          }
        } catch (error) {
          console.error(error)
        } finally {
          isFetching.current = false
        }
      },
      [postData?.id]
    )

    useEffect(() => {
      if (postData?.id) {
        fetchComments(1)
      }
    }, [fetchComments, postData?.id])

    useEffect(() => {
      const currentTarget = observerTarget.current
      if (!currentTarget || !hasMore) return

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isFetching.current) {
            const nextPage = pageRef.current + 1
            fetchComments(nextPage)
          }
        },
        { threshold: 0.1 }
      )

      observer.observe(currentTarget)

      return () => {
        if (currentTarget) observer.unobserve(currentTarget)
      }
    }, [hasMore, fetchComments])

    const handlePostLikeClick = async () => {
      if (!postData) return
      const isCurrentlyLiked = postData.isLiked
      const postId = postData.id

      try {
        if (isCurrentlyLiked) {
          await instance.delete(`api/v1/posts/${postId}/like`)
        } else {
          await instance.post(`api/v1/posts/${postId}/like`)
        }

        const updatedData = {
          ...postData,
          isLiked: !isCurrentlyLiked,
          likeCount: Math.max(
            0,
            postData.likeCount + (isCurrentlyLiked ? -1 : 1)
          ),
        }

        setPostData(updatedData)
        onDataChange?.(updatedData)
      } catch (error) {
        console.error(error)
      }
    }

    const handleBookmarkClick = async () => {
      if (!postData) return
      const isCurrentlyBookmarked = postData.isBookmarked
      const postId = postData.id

      try {
        if (isCurrentlyBookmarked) {
          await instance.delete(`api/v1/posts/${postId}/bookmark`)
        } else {
          await instance.post(`api/v1/posts/${postId}/bookmark`)
        }

        const updatedData = {
          ...postData,
          isBookmarked: !isCurrentlyBookmarked,
        }

        setPostData(updatedData)
        onDataChange?.(updatedData)
      } catch (error) {
        console.error(error)
      }
    }

    const handleCommentSubmit = async (content: string) => {
      const postId = postData?.id
      if (!postId) return

      try {
        if (editingComment) {
          const response = await instance
            .put(`api/v1/posts/${postId}/comments/${editingComment.id}`, {
              json: { content },
            })
            .json<{ data: Comment; success: boolean }>()

          if (response.success) {
            setComments((prev) =>
              prev.map((c) => (c.id === editingComment.id ? response.data : c))
            )
            setEditingComment(null)
          }
        } else {
          const response = await instance
            .post(`api/v1/posts/${postId}/comments`, {
              json: { content },
            })
            .json<{ data: Comment; success: boolean }>()

          if (response.success) {
            setComments((prev) => [response.data, ...prev])
            setLikedComments((prev) => ({
              ...prev,
              [response.data.id]: response.data.liked,
            }))
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    const handleHeartClick = async (
      commentId: number,
      e?: React.MouseEvent
    ) => {
      e?.stopPropagation()
      const postId = postData?.id
      if (!postId) return

      const isCurrentlyLiked = !!likedComments[commentId]

      try {
        if (isCurrentlyLiked) {
          await instance.delete(
            `api/v1/posts/${postId}/comments/${commentId}/like`
          )
        } else {
          await instance.post(
            `api/v1/posts/${postId}/comments/${commentId}/like`
          )
        }

        setLikedComments((p) => ({ ...p, [commentId]: !isCurrentlyLiked }))
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  likeCount: Math.max(
                    0,
                    c.likeCount + (isCurrentlyLiked ? -1 : 1)
                  ),
                }
              : c
          )
        )
      } catch (error) {
        console.error(error)
      }
    }

    const handleDoubleClick = (id: number) => {
      if (!likedComments[id]) {
        handleHeartClick(id)
      }
    }

    const handleDeleteSuccess = (commentId: number) => {
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    }

    const handleEditClick = (comment: Comment) => {
      setEditingComment(comment)
      setTimeout(() => {
        commentInputRef.current?.focus()
      }, 0)
    }

    const handleCommentIconClick = () => {
      if (editingComment) {
        setEditingComment(null)
      }
      setTimeout(() => {
        commentInputRef.current?.focus()
      }, 0)
    }

    const formattedFullDate = postData?.createdAt
      ? new Date(postData.createdAt).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : ''

    return (
      <div className="flex h-full flex-col bg-white">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/$userId"
              params={{ userId: String(postData?.userId) }}
              className="shrink-0 transition-opacity hover:opacity-80"
            >
              {postData?.profileImageUrl ? (
                <img
                  src={postData.profileImageUrl}
                  className="h-8 w-8 rounded-full object-cover"
                  alt=""
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200" />
              )}
            </Link>
            <Link
              to="/$userId"
              params={{ userId: String(postData?.userId) }}
              className="text-sm font-semibold text-black transition-opacity hover:opacity-60"
            >
              {postData?.nickname || ''}
            </Link>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="p-1">
            <MoreHorizontal className="h-6 w-6 text-black" />
          </button>
        </div>

        <div className="scrollbar-hide flex-1 overflow-y-auto px-3 py-2">
          <style
            dangerouslySetInnerHTML={{
              __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }`,
            }}
          />

          <div className="mb-2 flex gap-3 border-b border-gray-50 px-1 py-3">
            <Link
              to="/$userId"
              params={{ userId: String(postData?.userId) }}
              className="shrink-0 transition-opacity hover:opacity-80"
            >
              {postData?.profileImageUrl ? (
                <img
                  src={postData.profileImageUrl}
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                  alt=""
                />
              ) : (
                <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200" />
              )}
            </Link>
            <div className="text-sm text-black">
              <Link
                to="/$userId"
                params={{ userId: String(postData?.userId) }}
                className="mr-2 font-semibold text-black transition-opacity hover:opacity-60"
              >
                {postData?.nickname}
              </Link>
              <span className="whitespace-pre-wrap">{postData?.content}</span>
              <div className="mt-2 text-xs font-normal text-gray-500">
                {postData?.createdAt
                  ? formatRelativeTime(postData.createdAt)
                  : ''}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                isLiked={!!likedComments[comment.id]}
                onDoubleClick={handleDoubleClick}
                onHeartClick={handleHeartClick}
                onDeleteSuccess={handleDeleteSuccess}
                onEditClick={handleEditClick}
              />
            ))}
            {hasMore && <div ref={observerTarget} className="h-1" />}
          </div>
        </div>

        <PostActionSection
          likeCount={postData?.likeCount || 0}
          createdAt={formattedFullDate}
          isLiked={postData?.isLiked || false}
          isBookmarked={postData?.isBookmarked || false}
          onLikeClick={handlePostLikeClick}
          onBookmarkClick={handleBookmarkClick}
          onCommentSubmit={handleCommentSubmit}
          onCommentIconClick={handleCommentIconClick}
          inputRef={commentInputRef}
          editValue={editingComment?.content}
          onCancelEdit={() => setEditingComment(null)}
        />

        {isModalOpen && (
          <PostMenuModal
            onClose={() => setIsModalOpen(false)}
            postId={Number(postData?.id) || 0}
            nickname={postData?.nickname || ''}
            authorId={postData?.userId || 0}
            profileImageUrl={postData?.profileImageUrl || null}
          />
        )}
      </div>
    )
  }
)

PostInfoSection.displayName = 'PostInfoSection'
export default PostInfoSection
