import { useState, useEffect } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PostInfoSection from './PostInfoSection'

export interface PostData {
  id: string
  images: string[]
  caption: string
  username: string
  userImage: string
  createdAt: string
  likeCount: number
  commentCount: number
}

export default function PostDetail() {
  const { profile_name: postId } = useParams({ from: '/_app/p/$profile_name' })
  const navigate = useNavigate()

  const [postData, setPostData] = useState<PostData | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showHeart, setShowHeart] = useState(false)

  useEffect(() => {
    fetch(`/api/v1/posts/${postId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setPostData(json.data)
      })
  }, [postId])

  const images = postData?.images || []
  const handleClose = () => navigate({ to: '..' })

  const moveSlide = (step: number) => {
    if (images.length === 0) return
    setCurrentIndex((prev) =>
      Math.max(0, Math.min(prev + step, images.length - 1))
    )
  }

  const handleDoubleLike = () => {
    setShowHeart(true)
    setTimeout(() => setShowHeart(false), 1200)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
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
        className="absolute top-6 right-6 z-[110] text-white"
      >
        <X className="h-10 w-10" />
      </button>

      <div
        className="relative flex h-[90%] w-[95%] max-w-[1200px] overflow-hidden rounded-sm bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative hidden w-[60%] items-center justify-center overflow-hidden bg-black md:flex">
          <motion.div
            className="flex h-full w-full"
            animate={{ x: `-${currentIndex * 100}%` }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onDoubleClick={handleDoubleLike}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="flex h-full min-w-full flex-shrink-0 items-center justify-center"
              >
                <img
                  src={img}
                  alt=""
                  className="h-full w-full object-contain select-none"
                />
              </div>
            ))}
          </motion.div>

          <AnimatePresence>
            {showHeart && (
              <motion.div
                key="big-heart"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="pointer-events-none absolute z-[20] flex items-center justify-center"
              >
                <Heart
                  className="h-32 w-32 drop-shadow-lg"
                  style={{ fill: 'url(#heart-gradient)', stroke: 'none' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {images.length > 1 && currentIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                moveSlide(-1)
              }}
              className="absolute left-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-md"
            >
              <ChevronLeft className="h-5 w-5 text-black" strokeWidth={3} />
            </button>
          )}
          {images.length > 1 && currentIndex < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                moveSlide(1)
              }}
              className="absolute right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-md"
            >
              <ChevronRight className="h-5 w-5 text-black" strokeWidth={3} />
            </button>
          )}
        </div>

        <div className="flex w-full flex-col border-l border-gray-200 bg-white md:w-[40%]">
          <PostInfoSection data={postData} />
        </div>
      </div>
    </div>
  )
}
