import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from '@tanstack/react-router'
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PostInfoSection from './PostInfoSection'
import type { PostInfoSectionRef } from './PostInfoSection'
import { instance } from '../../shared/api/ky'

export interface PostImage {
  id: number
  url: string
  orderIndex: number
}

export interface PostData {
  id: number
  userId: number
  nickname: string
  profileImageUrl: string
  content: string
  albumId: number | null
  images: PostImage[]
  likeCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
  isLiked: boolean
  isBookmarked: boolean
}

interface SearchParams {
  returnToPath?: string
  returnToSearch?: Record<string, string>
}

export default function PostDetail() {
  const { post_id: postId } = useParams({ from: '/_app/p/$post_id' })
  const location = useLocation()
  const navigate = useNavigate()

  const [postData, setPostData] = useState<PostData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNotFound, setIsNotFound] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showHeart, setShowHeart] = useState(false)
  const [randomRotate, setRandomRotate] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const infoSectionRef = useRef<PostInfoSectionRef>(null)

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)
      setIsNotFound(false)

      if (!/^\d+$/.test(postId)) {
        setIsNotFound(true)
        setIsLoading(false)
        return
      }

      try {
        const res = await instance
          .get(`api/v1/posts/${postId}`)
          .json<{ data: PostData; isSuccess: boolean }>()

        if (res.isSuccess) {
          setPostData({ ...res.data })
        } else {
          setIsNotFound(true)
        }
      } catch {
        setIsNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPost()
  }, [postId])

  const images = postData?.images || []

  const handleClose = () => {
    const search = location.search as SearchParams
    const returnToPath = search.returnToPath
    const returnToSearch = search.returnToSearch

    if (returnToPath) {
      navigate({
        to: returnToPath,
        search: returnToSearch,
      })
    } else {
      navigate({ to: '/', search: { page: 1 } })
    }
  }

  const moveSlide = (step: number) => {
    if (images.length === 0) return
    setCurrentIndex((prev) =>
      Math.max(0, Math.min(prev + step, images.length - 1))
    )
  }

  const handleDoubleLike = async () => {
    if (isAnimating) return
    setIsAnimating(true)

    const rotate = Math.floor(Math.random() * 61) - 30
    setRandomRotate(rotate)
    setShowHeart(true)

    if (postData && !postData.isLiked) {
      await infoSectionRef.current?.handlePostLike()
    }

    setTimeout(() => {
      setShowHeart(false)
    }, 700)
  }

  const handlePostDataChange = (newData: PostData) => {
    setPostData({ ...newData })
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60"
      onClick={handleClose}
    >
      <svg width="0" height="0" className="absolute">
        <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF3040" />
          <stop offset="50%" stopColor="#D300C5" />
          <stop offset="100%" stopColor="#FF7A00" />
        </linearGradient>
      </svg>

      <button
        onClick={handleClose}
        className="absolute top-6 right-6 z-110 text-white"
      >
        <X className="h-10 w-10" />
      </button>

      <div
        className="relative flex h-fit max-h-[90%] w-[95%] max-w-[1200px] overflow-hidden rounded-sm bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {(isLoading || isNotFound) && (
          <>
            <div
              className="relative hidden w-[60%] items-center justify-center bg-black md:flex"
              style={{ aspectRatio: '1 / 1' }}
            />
            <div className="flex w-full flex-col items-center justify-center border-l border-gray-200 bg-white md:w-[40%]">
              {isLoading && (
                <p className="text-sm text-gray-500">게시물을 불러오는 중...</p>
              )}
              {isNotFound && (
                <div className="flex flex-col items-center justify-center gap-4 p-8">
                  <p className="text-lg font-semibold">
                    게시물을 찾을 수 없습니다
                  </p>
                  <p className="text-center text-sm text-gray-500">
                    삭제되었거나 잘못된 링크일 수 있습니다.
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                  >
                    돌아가기
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {!isLoading && !isNotFound && (
          <>
            <div className="relative hidden w-[60%] flex-col items-center justify-center bg-black md:flex">
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: '1 / 1' }}
              >
                <motion.div
                  className="flex h-full w-full"
                  animate={{ x: `-${currentIndex * 100}%` }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  onDoubleClick={handleDoubleLike}
                >
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="flex h-full min-w-full shrink-0 items-center justify-center"
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="h-full w-full object-cover select-none"
                      />
                    </div>
                  ))}
                </motion.div>

                <AnimatePresence>
                  {showHeart && (
                    <motion.div
                      key="rising-heart"
                      initial={{
                        scale: 0,
                        opacity: 1,
                        y: 0,
                        rotate: randomRotate,
                      }}
                      animate={{
                        scale: [0, 1.2, 1],
                        y: -20,
                        rotate: [randomRotate, randomRotate, 0],
                      }}
                      exit={{
                        y: -700,
                        transition: { duration: 0.2, ease: 'circIn' },
                      }}
                      transition={{
                        duration: 0.7,
                        times: [0, 0.57, 1],
                        ease: 'easeInOut',
                      }}
                      onAnimationComplete={() => setIsAnimating(false)}
                      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
                    >
                      <Heart
                        className="h-32 w-32 drop-shadow-2xl"
                        style={{ fill: 'url(#heart-gradient)', stroke: 'none' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {images.length > 1 && currentIndex > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      moveSlide(-1)
                    }}
                    className="absolute top-1/2 left-4 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white"
                  >
                    <ChevronLeft
                      className="h-5 w-5 text-black"
                      strokeWidth={3}
                    />
                  </button>
                )}
                {images.length > 1 && currentIndex < images.length - 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      moveSlide(1)
                    }}
                    className="absolute top-1/2 right-4 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white"
                  >
                    <ChevronRight
                      className="h-5 w-5 text-black"
                      strokeWidth={3}
                    />
                  </button>
                )}

                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-1.5">
                    {images.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full transition-colors ${
                          i === currentIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex w-full flex-col border-l border-gray-200 bg-white md:w-[40%]">
              <PostInfoSection
                data={postData}
                ref={infoSectionRef}
                onDataChange={handlePostDataChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
