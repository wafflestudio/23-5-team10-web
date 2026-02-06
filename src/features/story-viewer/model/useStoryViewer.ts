import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { StoryFeedItem } from '@/entities/story/model/types'

export function useStoryViewer(
  storiesData: StoryFeedItem[],
  initialUserId: string
) {
  const navigate = useNavigate()

  const currentUserIndex = useMemo(() => {
    const index = storiesData.findIndex(
      (u) => String(u.userId) === String(initialUserId)
    )
    return index !== -1 ? index : 0
  }, [storiesData, initialUserId])

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prevUserId, setPrevUserId] = useState(initialUserId)

  if (prevUserId !== initialUserId) {
    setPrevUserId(initialUserId)
    setCurrentStoryIndex(0)
    setProgress(0)
  }

  const currentUser = storiesData[currentUserIndex]
  const currentStory = currentUser?.stories?.[currentStoryIndex]

  const handleNext = useCallback(() => {
    if (!currentUser || !currentUser.stories) return

    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1)
      setProgress(0)
    } else if (currentUserIndex < storiesData.length - 1) {
      const nextUser = storiesData[currentUserIndex + 1]
      setTimeout(() => {
        navigate({
          to: '/stories/$user_id',
          params: { user_id: String(nextUser.userId) },
        })
      }, 0)
    } else {
      setTimeout(() => {
        navigate({ to: '/' })
      }, 0)
    }
  }, [currentUser, currentStoryIndex, currentUserIndex, storiesData, navigate])

  const handlePrev = useCallback(() => {
    if (!currentUser || !currentUser.stories) return

    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1)
      setProgress(0)
    } else if (currentUserIndex > 0) {
      const prevUser = storiesData[currentUserIndex - 1]
      setTimeout(() => {
        navigate({
          to: '/stories/$user_id',
          params: { user_id: String(prevUser.userId) },
        })
      }, 0)
    }
  }, [currentUser, currentStoryIndex, currentUserIndex, storiesData, navigate])

  const togglePause = useCallback(() => setIsPaused((prev) => !prev), [])

  useEffect(() => {
    if (isPaused || !currentUser || !currentUser.stories) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext()
          return 100
        }
        return prev + 1
      })
    }, 50)
    return () => clearInterval(interval)
  }, [handleNext, isPaused, currentUser])

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
