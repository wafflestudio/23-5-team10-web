import { useState, useEffect, useRef, useCallback } from 'react'
import { MoreHorizontal } from 'lucide-react'
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
  likeCount?: number
}

export default function PostInfoSection({ data }: { data: PostData | null }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [likedComments, setLikedComments] = useState<{
    [key: number]: boolean
  }>({})
  const [hasMore, setHasMore] = useState(true)
  const [showReplies, setShowReplies] = useState<{ [key: number]: boolean }>({})
  const observerTarget = useRef<HTMLDivElement>(null)
  const pageRef = useRef(1)
  const isFetching = useRef(false)

  const fetchComments = useCallback(
    async (pageNum: number) => {
      const postId = data?.id
      if (!postId || isFetching.current) return

      isFetching.current = true
      try {
        const response = await fetch(
          `/api/v1/posts/${postId}/comments?page=${pageNum}`
        )
        const result = await response.json()

        if (result.success && result.data.length > 0) {
          setComments((prev) => {
            if (pageNum === 1) return result.data
            const existingIds = new Set(prev.map((c) => c.id))
            const newComments = result.data.filter(
              (c: Comment) => !existingIds.has(c.id)
            )
            return [...prev, ...newComments]
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
    [data?.id]
  )

  useEffect(() => {
    if (data?.id) {
      fetchComments(1)
    }
  }, [fetchComments, data?.id])

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

  const handleHeartClick = async (commentId: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const postId = data?.id
    if (!postId) return

    const isCurrentlyLiked = !!likedComments[commentId]

    try {
      if (isCurrentlyLiked) {
        await instance.delete(
          `api/v1/posts/${postId}/comments/${commentId}/like`
        )
      } else {
        await instance.post(`api/v1/posts/${postId}/comments/${commentId}/like`)
      }

      setLikedComments((p) => ({ ...p, [commentId]: !isCurrentlyLiked }))
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                likeCount: Math.max(
                  0,
                  (c.likeCount || 0) + (isCurrentlyLiked ? -1 : 1)
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

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={data?.profileImageUrl || ''}
            className="h-8 w-8 rounded-full object-cover"
            alt=""
          />
          <div className="text-sm font-semibold text-black">
            {data?.nickname || ''}
          </div>
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

        <div className="mb-2 flex gap-3 px-1 py-3">
          <img
            src={data?.profileImageUrl || ''}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
            alt=""
          />
          <div className="text-sm text-black">
            <span className="mr-2 font-semibold">{data?.nickname}</span>
            <span className="whitespace-pre-wrap">{data?.content}</span>
            <div className="mt-2 text-xs font-normal text-gray-500">
              {data?.createdAt ? formatRelativeTime(data.createdAt) : ''}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {comments
            .filter((c) => c.parentId === null)
            .map((comment) => {
              const replyCount = comments.filter(
                (r) => r.parentId === comment.id
              ).length
              return (
                <div key={comment.id} className="mb-1">
                  <CommentItem
                    comment={comment}
                    isLiked={!!likedComments[comment.id]}
                    onDoubleClick={handleDoubleClick}
                    onHeartClick={handleHeartClick}
                  />

                  {replyCount > 0 && (
                    <div className="ml-12">
                      <button
                        onClick={() =>
                          setShowReplies((p) => ({
                            ...p,
                            [comment.id]: !p[comment.id],
                          }))
                        }
                        className="flex items-center gap-2 py-2 text-xs font-semibold text-gray-500"
                      >
                        <div className="h-[1px] w-6 bg-gray-300" />
                        {showReplies[comment.id]
                          ? '답글 숨기기'
                          : `답글 보기(${replyCount}개)`}
                      </button>
                      {showReplies[comment.id] &&
                        comments
                          .filter((r) => r.parentId === comment.id)
                          .map((r) => (
                            <CommentItem
                              key={r.id}
                              comment={r}
                              isReply
                              isLiked={!!likedComments[r.id]}
                              onDoubleClick={handleDoubleClick}
                              onHeartClick={handleHeartClick}
                            />
                          ))}
                    </div>
                  )}
                </div>
              )
            })}
          <div ref={observerTarget} className="h-1" />
        </div>
      </div>

      <PostActionSection
        likeCount={data?.likeCount || 0}
        createdAt={data?.createdAt ? formatRelativeTime(data.createdAt) : ''}
        isLiked={data?.liked || false}
        isBookmarked={data?.bookmarked || false}
        onLikeClick={() => {}}
        onBookmarkClick={() => {}}
        onCommentSubmit={() => {}}
      />

      {isModalOpen && <PostMenuModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
