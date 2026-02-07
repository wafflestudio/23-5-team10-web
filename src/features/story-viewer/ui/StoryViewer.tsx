import { useState, useEffect } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  MoreHorizontal,
} from 'lucide-react'
import { useNavigate, Link } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import type { StoryFeedItem, Story } from '@/entities/story/model/types'
import { useStoryViewer } from '../model/useStoryViewer'
import { STORY_VIEWER_UI } from './constants'
import { StoryOptionsModal } from './StoryOptionsModal'
import ReportModal from '@/components/post/ReportModal'
import AccountInfoModal from '@/components/post/AccountInfoModal'
import { instance } from '@/shared/api/ky'
import { useCurrentUser } from '@/shared/auth/useCurrentUser'
import instagramLogo from '@/assets/instagram-black-logo.png'

interface StoryViewerProps {
  feed: StoryFeedItem[]
  userId: string
  detailUser?: StoryFeedItem
  isDetailLoading?: boolean
  onClose?: () => void
}

const formatRelativeTime = (createdAt: string) => {
  const now = new Date()
  const created = new Date(createdAt)
  const diffInMinutes = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60)
  )
  if (diffInMinutes < 1) return '방금 전'
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`
  const diffInHours = Math.floor(diffInMinutes / 60)
  return `${diffInHours}시간 전`
}

export function StoryViewer({
  feed,
  userId,
  detailUser,
  isDetailLoading,
  onClose,
}: StoryViewerProps) {
  const navigate = useNavigate()

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      navigate({ to: '/', search: { page: 1 } })
    }
  }
  const queryClient = useQueryClient()
  const { data: me, isLoading: isMeLoading } = useCurrentUser()

  const [imageError, setImageError] = useState(false)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  const {
    currentUser,
    currentStory,
    currentStoryIndex,
    currentUserIndex,
    progress,
    isPaused,
    handleNext,
    handlePrev,
    togglePause,
  } = useStoryViewer(feed, userId, { onComplete: onClose })

  const viewerUser =
    detailUser && String(detailUser.userId) === String(userId)
      ? detailUser
      : currentUser

  const isMine =
    !isMeLoading &&
    me?.userId !== undefined &&
    viewerUser?.userId !== undefined &&
    String(me.userId) === String(viewerUser.userId)

  useEffect(() => {
    if (imageError && !isPaused) {
      togglePause()
    }
  }, [imageError, isPaused, togglePause])

  if (!viewerUser || !currentStory) return null

  const isFirstStoryOfFirstUser =
    currentUserIndex === 0 && currentStoryIndex === 0
  const isLastStoryOfLastUser =
    currentUserIndex === feed.length - 1 &&
    currentStoryIndex === (viewerUser.stories.length ?? 0) - 1

  const handleOpenOptions = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isPaused) togglePause()
    setIsOptionsOpen(true)
  }

  const handleCloseOptions = () => {
    setIsOptionsOpen(false)
    if (isPaused && !imageError) togglePause()
  }

  const handleOpenReport = () => {
    setIsOptionsOpen(false)
    setIsReportOpen(true)
  }

  const handleOpenAccountInfo = () => {
    setIsOptionsOpen(false)
    setIsAccountInfoOpen(true)
  }

  const handleOpenDeleteConfirm = () => {
    setIsOptionsOpen(false)
    setIsDeleteConfirmOpen(true)
  }

  const handleDeleteStory = async () => {
    try {
      const response = await instance
        .delete(`api/v1/stories/${currentStory.id}`)
        .json<{ isSuccess: boolean; code: string; message: string }>()
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ['stories', 'feed'] })
        queryClient.invalidateQueries({ queryKey: ['stories', 'user', userId] })
        handleClose()
      }
    } catch (error) {
      console.error('스토리 삭제 실패:', error)
    }
  }

  return (
    <div className={STORY_VIEWER_UI.STYLES.CONTAINER}>
      <div className="absolute top-0 left-0 z-50 p-0 leading-none">
        <Link to="/" search={{ page: 1 }}>
          <img
            src={instagramLogo}
            alt="Instagram"
            className="block h-14 w-auto"
          />
        </Link>
      </div>

      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 p-2 text-white transition-opacity hover:opacity-70"
      >
        <X className="h-9 w-9" strokeWidth={1.5} />
      </button>

      {!isFirstStoryOfFirstUser && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setImageError(false)
            handlePrev()
          }}
          className="absolute left-8 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/40 active:scale-95"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
      )}

      <div className={STORY_VIEWER_UI.STYLES.VIEWER_CARD}>
        {isDetailLoading && !currentStory.imageUrl && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-white" />
          </div>
        )}

        <div className={STORY_VIEWER_UI.STYLES.OVERLAY_TOP}>
          <div className={STORY_VIEWER_UI.STYLES.PROGRESS_CONTAINER}>
            {viewerUser.stories.map((story: Story, i: number) => (
              <div
                key={story.id}
                className={STORY_VIEWER_UI.STYLES.PROGRESS_BAR}
              >
                <div
                  className={STORY_VIEWER_UI.STYLES.PROGRESS_BAR_FILL}
                  style={{
                    width:
                      i === currentStoryIndex
                        ? `${progress}%`
                        : i < currentStoryIndex
                          ? '100%'
                          : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          <div className={STORY_VIEWER_UI.STYLES.HEADER}>
            <Link
              to="/$userId"
              params={{ userId: String(viewerUser.userId) }}
              className={STORY_VIEWER_UI.STYLES.USER_SECTION}
            >
              <img
                src={viewerUser.profileImageUrl ?? ''}
                className={STORY_VIEWER_UI.STYLES.AVATAR}
                alt=""
              />
              <div className={STORY_VIEWER_UI.STYLES.USER_INFO}>
                <span className="font-bold">{viewerUser.nickname}</span>
                <span className="text-[13px] font-normal opacity-60">
                  {formatRelativeTime(currentStory.createdAt)}
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!imageError) togglePause()
                }}
                className="p-1 text-white transition-opacity hover:opacity-70 disabled:opacity-30"
                disabled={imageError}
              >
                {isPaused ? (
                  <Play className="h-5 w-5 fill-current" />
                ) : (
                  <Pause className="h-5 w-5 fill-current" />
                )}
              </button>
              <button
                className="p-1 text-white transition-opacity hover:opacity-70"
                onClick={handleOpenOptions}
              >
                <MoreHorizontal className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div
          className={STORY_VIEWER_UI.STYLES.CONTENT_AREA}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            setImageError(false)
            if (e.clientX - rect.left < rect.width / 2) handlePrev()
            else handleNext()
          }}
        >
          {imageError ? (
            <div className="flex h-full w-full items-center justify-center bg-black text-white">
              더 이상 이용할 수 없는 콘텐츠입니다
            </div>
          ) : (
            <>
              <img
                src={currentStory.imageUrl}
                className="h-full w-full object-cover select-none"
                alt="story"
                onError={() => setImageError(true)}
                referrerPolicy="no-referrer"
              />

              {isMine && currentStory.viewCount !== undefined && (
                <div className="absolute bottom-4 left-4 z-50 text-white">
                  {currentStory.viewCount}명이 읽음
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {!isLastStoryOfLastUser && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setImageError(false)
            handleNext()
          }}
          className="absolute right-8 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/40 active:scale-95"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      )}

      <StoryOptionsModal
        isOpen={isOptionsOpen}
        onClose={handleCloseOptions}
        isMine={isMine}
        userId={viewerUser.userId}
        onReport={handleOpenReport}
        onAccountInfo={handleOpenAccountInfo}
        onDelete={handleOpenDeleteConfirm}
      />

      {isReportOpen && (
        <ReportModal
          onClose={() => {
            setIsReportOpen(false)
            if (isPaused && !imageError) togglePause()
          }}
          onHideComment={() => {}}
          nickname={viewerUser.nickname}
          type="post"
        />
      )}

      {isAccountInfoOpen && (
        <AccountInfoModal
          onClose={() => {
            setIsAccountInfoOpen(false)
            if (isPaused && !imageError) togglePause()
          }}
          nickname={viewerUser.nickname}
          profileImageUrl={viewerUser.profileImageUrl}
        />
      )}

      {isDeleteConfirmOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4"
          onClick={() => {
            setIsDeleteConfirmOpen(false)
            if (isPaused && !imageError) togglePause()
          }}
        >
          <div
            className="w-full max-w-[400px] overflow-hidden rounded-[12px] bg-white text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-8 py-6">
              <h2 className="mb-2 text-[18px] font-bold text-black">
                스토리를 삭제하시겠어요?
              </h2>
              <p className="text-[14px] text-gray-500">
                스토리에서 이 사진을 삭제하시겠어요?
              </p>
            </div>
            <button
              onClick={handleDeleteStory}
              className="w-full border-t border-gray-200 py-3 text-[14px] font-bold text-red-500"
            >
              삭제
            </button>
            <button
              onClick={() => {
                setIsDeleteConfirmOpen(false)
                if (isPaused && !imageError) togglePause()
              }}
              className="w-full border-t border-gray-200 py-3 text-[14px]"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
