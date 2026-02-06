import { useState } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  MoreHorizontal,
} from 'lucide-react'
import { useNavigate, Link } from '@tanstack/react-router'
import type { StoryFeedItem, Story } from '@/entities/story/model/types'
import { useStoryViewer } from '../model/useStoryViewer'
import { STORY_VIEWER_UI } from './constants'

import instagramLogo from '@/assets/instagram-black-logo.png'

interface StoryViewerProps {
  feed: StoryFeedItem[]
  userId: string
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

export function StoryViewer({ feed, userId }: StoryViewerProps) {
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)

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
  } = useStoryViewer(feed, userId)

  if (!currentUser || !currentStory) return null

  const isFirstStoryOfFirstUser =
    currentUserIndex === 0 && currentStoryIndex === 0
  const isLastStoryOfLastUser =
    currentUserIndex === feed.length - 1 &&
    currentStoryIndex === currentUser.stories.length - 1

  return (
    <div className={STORY_VIEWER_UI.STYLES.CONTAINER}>
      <div className="absolute top-0 left-0 z-50 p-0 leading-none">
        <Link to="/">
          <img
            src={instagramLogo}
            alt="Instagram"
            className="block h-14 w-auto"
          />
        </Link>
      </div>

      <button
        onClick={() => navigate({ to: '/' })}
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
        <div className={STORY_VIEWER_UI.STYLES.OVERLAY_TOP}>
          <div className={STORY_VIEWER_UI.STYLES.PROGRESS_CONTAINER}>
            {currentUser.stories.map((story: Story, i: number) => (
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
              params={{ userId: currentUser.userId }}
              className={STORY_VIEWER_UI.STYLES.USER_SECTION}
            >
              <img
                src={currentUser.profileImageUrl ?? ''}
                className={STORY_VIEWER_UI.STYLES.AVATAR}
                alt=""
              />
              <div className={STORY_VIEWER_UI.STYLES.USER_INFO}>
                <span className="font-bold">{currentUser.nickname}</span>
                <span className="text-[13px] font-normal opacity-60">
                  {formatRelativeTime(currentStory.createdAt)}
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  togglePause()
                }}
                className="p-1 text-white transition-opacity hover:opacity-70"
              >
                {isPaused ? (
                  <Play className="h-5 w-5 fill-current" />
                ) : (
                  <Pause className="h-5 w-5 fill-current" />
                )}
              </button>
              <button
                className="p-1 text-white transition-opacity hover:opacity-70"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div
          className={STORY_VIEWER_UI.STYLES.CONTENT_AREA}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect()
            setImageError(false)
            if (e.clientX - rect.left < rect.width / 2) handlePrev()
            else handleNext()
          }}
        >
          {imageError ? (
            <div className="flex h-full w-full flex-col items-center justify-center bg-black px-10 text-center text-white">
              <p className="text-[14px] leading-relaxed font-medium">
                더 이상 이용할 수 없는 콘텐츠입니다
              </p>
            </div>
          ) : (
            <img
              key={currentStory.imageUrl}
              src={currentStory.imageUrl}
              className="h-full w-full object-cover select-none"
              alt="story"
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
            />
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
    </div>
  )
}
