import { X } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { STORY_VIEWER_UI } from './constants'

interface StoryDetailViewProps {
  profileName: string
  storyId: string
}

export function StoryDetailView({
  profileName,
  storyId,
}: StoryDetailViewProps) {
  const navigate = useNavigate()

  return (
    <div className={STORY_VIEWER_UI.STYLES.CONTAINER}>
      <div className={STORY_VIEWER_UI.STYLES.VIEWER_CARD}>
        <div className={STORY_VIEWER_UI.STYLES.OVERLAY_TOP}>
          <div className={STORY_VIEWER_UI.STYLES.PROGRESS_CONTAINER}>
            <div className={STORY_VIEWER_UI.STYLES.PROGRESS_BAR}>
              <div
                className={STORY_VIEWER_UI.STYLES.PROGRESS_BAR_FILL}
                style={{ width: '30%' }}
              />
            </div>
          </div>

          <div className={STORY_VIEWER_UI.STYLES.HEADER}>
            <div className={STORY_VIEWER_UI.STYLES.USER_SECTION}>
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-600" />
              <div className={STORY_VIEWER_UI.STYLES.USER_INFO}>
                <span>{profileName}</span>
                <span className="text-xs opacity-60">
                  {STORY_VIEWER_UI.MESSAGES.TIME_AGO}
                </span>
              </div>
            </div>

            <div className={STORY_VIEWER_UI.STYLES.CONTROL_SECTION}>
              <button
                onClick={() => navigate({ to: '/', search: { page: 1 } })}
                className="text-white transition-opacity hover:opacity-80"
              >
                <X className="h-7 w-7" />
              </button>
            </div>
          </div>
        </div>

        <div className={STORY_VIEWER_UI.STYLES.CONTENT_AREA}>
          <div className="flex h-full w-full items-center justify-center bg-gray-800 text-white/20">
            <span className="text-sm font-bold">Story Image ({storyId})</span>
          </div>
        </div>
      </div>
    </div>
  )
}
