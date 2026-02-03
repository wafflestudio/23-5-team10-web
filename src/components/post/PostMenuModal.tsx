import { useState } from 'react'
import ReportModal from './ReportModal'
import { useCurrentUserId } from '@/shared/auth/useCurrentUser'
import { useFollowing } from '@/features/follow-user/model/useFollowing'
import { useToggleFollow } from '@/features/follow-user/model/useToggleFollow'

interface PostMenuModalProps {
  onClose: () => void
  nickname: string
  authorId: number
}

export default function PostMenuModal({
  onClose,
  nickname,
  authorId,
}: PostMenuModalProps) {
  const [isReportOpen, setIsReportOpen] = useState(false)
  const currentUserId = useCurrentUserId()

  const { data: followingList } = useFollowing({ userId: currentUserId ?? 0 })
  const { mutate: toggleFollow } = useToggleFollow({
    userId: authorId,
    profileUserId: authorId,
  })

  const isMe = currentUserId === authorId
  const isFollowing =
    followingList?.some((user) => user.userId === authorId) ?? false

  const handleFollowClick = () => {
    toggleFollow()
    onClose()
  }

  if (isReportOpen) {
    return (
      <ReportModal
        onClose={onClose}
        nickname={nickname}
        onHideComment={() => {}}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div
        className="w-full max-w-[400px] overflow-hidden rounded-[12px] bg-white text-center text-[14px]"
        onClick={(e) => e.stopPropagation()}
      >
        {isMe ? (
          <>
            <button className="w-full border-b border-gray-200 py-3 font-bold text-red-500 active:bg-gray-100">
              삭제
            </button>
            <button className="w-full border-b border-gray-200 py-3 active:bg-gray-100">
              수정
            </button>
            <button className="w-full border-b border-gray-200 py-3 active:bg-gray-100">
              다른 사람에게 좋아요 수 숨기기
            </button>
            <button className="w-full border-b border-gray-200 py-3 active:bg-gray-100">
              댓글 기능 해제
            </button>
          </>
        ) : isFollowing ? (
          <>
            <button
              onClick={() => setIsReportOpen(true)}
              className="w-full border-b border-gray-200 py-3 font-bold text-red-500 active:bg-gray-100"
            >
              신고
            </button>
            <button
              onClick={handleFollowClick}
              className="w-full border-b border-gray-200 py-3 font-bold text-red-500 active:bg-gray-100"
            >
              팔로우 취소
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsReportOpen(true)}
              className="w-full border-b border-gray-200 py-3 font-bold text-red-500 active:bg-gray-100"
            >
              신고
            </button>
            <button className="w-full border-b border-gray-200 py-3 active:bg-gray-100">
              공유 대상...
            </button>
            <button className="w-full border-b border-gray-200 py-3 active:bg-gray-100">
              링크 복사
            </button>
            <button className="w-full border-b border-gray-200 py-3 active:bg-gray-100">
              퍼가기
            </button>
          </>
        )}

        <button className="w-full border-b border-gray-200 py-3 active:bg-gray-100">
          이 계정 정보
        </button>
        <button onClick={onClose} className="w-full py-3 active:bg-gray-100">
          취소
        </button>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
