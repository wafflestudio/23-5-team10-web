import { useParams, useNavigate } from '@tanstack/react-router'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import PostInfoSection from './PostInfoSection'

export default function PostDetail() {
  const { profile_name } = useParams({ from: '/_app/p/$profile_name' })
  const navigate = useNavigate()

  const handleClose = () => {
    navigate({ to: `/${profile_name}` })
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
      onClick={handleClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleClose()
        }}
        className="absolute top-6 right-6 z-[110] text-white"
      >
        <X className="h-10 w-10" />
      </button>

      <button
        className="absolute left-4 z-[110] flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-gray-200 md:left-8"
        onClick={(e) => e.stopPropagation()}
      >
        <ChevronLeft className="h-5 w-5 text-black" strokeWidth={3} />
      </button>

      <button
        className="absolute right-4 z-[110] flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-gray-200 md:right-8"
        onClick={(e) => e.stopPropagation()}
      >
        <ChevronRight className="h-5 w-5 text-black" strokeWidth={3} />
      </button>

      <div
        className="relative flex h-[90%] w-[95%] max-w-[1200px] overflow-hidden rounded-sm bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hidden w-[60%] bg-black md:flex" />
        <div className="flex w-full flex-col border-l border-gray-200 bg-white md:w-[40%]">
          <PostInfoSection />
        </div>
      </div>
    </div>
  )
}
