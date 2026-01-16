import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import type { PostData } from './PostDetail'
import PostMenuModal from './PostMenuModal'

interface PostInfoSectionProps {
  data: PostData | null
}

export default function PostInfoSection({ data }: PostInfoSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <img
            src={data?.userImage || 'https://via.placeholder.com/32'}
            className="h-8 w-8 rounded-full object-cover"
            alt="profile"
          />
          <div className="flex flex-col">
            <div className="text-sm font-semibold text-black">
              {data?.username || 'loading...'}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="p-1 transition-opacity hover:opacity-50"
        >
          <MoreHorizontal className="h-6 w-6 text-black" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 flex gap-3">
          <img
            src={data?.userImage || 'https://via.placeholder.com/32'}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
            alt="profile"
          />
          <div className="text-sm text-black">
            <span className="mr-2 font-semibold">{data?.username}</span>
            <span className="whitespace-pre-wrap">{data?.caption}</span>
            <div className="mt-2 text-xs text-gray-500">
              {data?.createdAt
                ? new Date(data.createdAt).toLocaleDateString()
                : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4 text-black">
        <div className="text-[10px] text-gray-500 uppercase">
          {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : ''}
        </div>
      </div>

      {isModalOpen && <PostMenuModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
