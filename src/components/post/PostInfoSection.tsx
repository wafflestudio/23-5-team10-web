import type { PostData } from './PostDetail'

interface PostInfoSectionProps {
  data: PostData | null
}

export default function PostInfoSection({ data }: PostInfoSectionProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-200 p-4">
        <img
          src={data?.userImage || 'https://via.placeholder.com/32'}
          className="h-8 w-8 rounded-full object-cover"
          alt="profile"
        />
        <div className="text-sm font-semibold text-black">
          {data?.username || 'loading...'}
        </div>
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
            {data?.caption}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4 text-black">
        <div className="mb-1 text-sm font-semibold">
          좋아요 {data?.likeCount?.toLocaleString() || 0}개
        </div>
        <div className="text-[10px] text-gray-500 uppercase">
          {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : ''}
        </div>
      </div>
    </div>
  )
}
