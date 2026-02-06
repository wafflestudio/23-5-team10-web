import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { StoryFeedItem } from '@/entities/story/model/types'

export function useStoryViewer(
  storiesData: StoryFeedItem[],
  initialUserId: string
) {
  const navigate = useNavigate()
  const STORY_DURATION = 5000
  const INTERVAL_MS = 10

  const currentUserIndex = useMemo(() => {
    return storiesData.findIndex(
      (u) => String(u.userId) === String(initialUserId)
    )
  }, [storiesData, initialUserId])

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const [prevUserId, setPrevUserId] = useState(initialUserId)

  if (prevUserId !== initialUserId) {
    setPrevUserId(initialUserId)
    setCurrentStoryIndex(0)
    setProgress(0)
    setIsPaused(false)
  }

  const currentUser = storiesData[currentUserIndex]
  const currentStory = currentUser?.stories?.[currentStoryIndex]

  const handleNext = useCallback(() => {
    if (!currentUser) return
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1)
      setProgress(0)
    } else if (currentUserIndex < storiesData.length - 1) {
      const nextUser = storiesData[currentUserIndex + 1]
      navigate({
        to: '/stories/$user_id',
        params: { user_id: String(nextUser.userId) },
      })
    } else {
      navigate({ to: '/', search: { page: 1 } })
    }
  }, [currentUser, currentStoryIndex, currentUserIndex, storiesData, navigate])

  const handlePrev = useCallback(() => {
    if (!currentUser) return
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1)
      setProgress(0)
    } else if (currentUserIndex > 0) {
      const prevUser = storiesData[currentUserIndex - 1]
      navigate({
        to: '/stories/$user_id',
        params: { user_id: String(prevUser.userId) },
      })
    }
  }, [currentUser, currentStoryIndex, currentUserIndex, storiesData, navigate])

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev)
  }, [])

  useEffect(() => {
    if (isPaused || !currentStory) return

    const step = (INTERVAL_MS / STORY_DURATION) * 100
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext()
          return 100
        }
        return prev + step
      })
    }, INTERVAL_MS)

    return () => clearInterval(timer)
  }, [isPaused, currentStoryIndex, handleNext, currentStory])

  return {
    currentUser,
    currentStory,
    currentStoryIndex,
    currentUserIndex,
    progress,
    isPaused,
    handleNext,
    handlePrev,
    togglePause,
  }
}
