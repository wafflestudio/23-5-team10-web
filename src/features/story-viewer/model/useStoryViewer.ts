import { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { StoryFeedItem } from '@/entities/story/model/types'

type UseStoryViewerOptions = {
  onComplete?: () => void
}

export function useStoryViewer(
  storiesData: StoryFeedItem[],
  initialUserId: string,
  options?: UseStoryViewerOptions
) {
  const navigate = useNavigate()
  const { onComplete } = options ?? {}
  const STORY_DURATION = 5000
  const INTERVAL_MS = 10

  const currentUserIndex = useMemo(() => {
    return storiesData.findIndex(
      (u) => String(u.userId) === String(initialUserId)
    )
  }, [storiesData, initialUserId])

  const [state, setState] = useState(() => ({
    userId: initialUserId,
    storyIndex: 0,
    progress: 0,
    isPaused: false,
  }))

  if (state.userId !== initialUserId) {
    setState({
      userId: initialUserId,
      storyIndex: 0,
      progress: 0,
      isPaused: false,
    })
  }

  const currentUser = storiesData[currentUserIndex]
  const currentStory = currentUser?.stories?.[state.storyIndex]

  const handleNext = useCallback(() => {
    if (!currentUser) return

    if (state.storyIndex < currentUser.stories.length - 1) {
      setState((prev) => ({
        ...prev,
        storyIndex: prev.storyIndex + 1,
        progress: 0,
      }))
    } else if (currentUserIndex < storiesData.length - 1) {
      const nextUser = storiesData[currentUserIndex + 1]
      navigate({
        to: '/stories/$user_id',
        params: { user_id: String(nextUser.userId) },
      })
    } else if (onComplete) {
      onComplete()
    } else {
      navigate({ to: '/', search: { page: 1 } })
    }
  }, [
    currentUser,
    state.storyIndex,
    currentUserIndex,
    storiesData,
    navigate,
    onComplete,
  ])

  const handlePrev = useCallback(() => {
    if (!currentUser) return

    if (state.storyIndex > 0) {
      setState((prev) => ({
        ...prev,
        storyIndex: prev.storyIndex - 1,
        progress: 0,
      }))
    } else if (currentUserIndex > 0) {
      const prevUser = storiesData[currentUserIndex - 1]
      navigate({
        to: '/stories/$user_id',
        params: { user_id: String(prevUser.userId) },
      })
    }
  }, [currentUser, state.storyIndex, currentUserIndex, storiesData, navigate])

  const togglePause = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }))
  }, [])

  useEffect(() => {
    if (state.isPaused || !currentStory) return

    const step = (INTERVAL_MS / STORY_DURATION) * 100
    const timer = setInterval(() => {
      setState((prev) => {
        if (prev.progress >= 100) {
          handleNext()
          return prev
        }
        return {
          ...prev,
          progress: prev.progress + step,
        }
      })
    }, INTERVAL_MS)

    return () => clearInterval(timer)
  }, [state.isPaused, currentStory, handleNext])

  return {
    currentUser,
    currentStory,
    currentStoryIndex: state.storyIndex,
    currentUserIndex,
    progress: state.progress,
    isPaused: state.isPaused,
    handleNext,
    handlePrev,
    togglePause,
  }
}
