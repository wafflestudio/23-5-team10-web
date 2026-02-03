import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import ReportModal from './ReportModal'
import AccountInfoModal from './AccountInfoModal'
import EmbedModal from './EmbedModal'
import { useCurrentUserId } from '@/shared/auth/useCurrentUser'
import { useFollowing } from '@/features/follow-user/model/useFollowing'
import { useToggleFollow } from '@/features/follow-user/model/useToggleFollow'
import { instance } from '@/shared/api/ky'

interface PostMenuModalProps {
  onClose: () => void
  nickname: string
  authorId: number
  postId: number
  profileImageUrl: string | null
}

export default function PostMenuModal({
  onClose,
  nickname,
  authorId,
  postId,
  profileImageUrl,
}: PostMenuModalProps) {
  const [activeModal, setActiveModal] = useState<
    'menu' | 'report' | 'account' | 'embed' | 'delete_confirm'
  >('menu')
  const [showToast, setShowToast] = useState(false)
  const navigate = useNavigate()
  const currentUserId = useCurrentUserId()

  const { data: followingList } = useFollowing({ userId: currentUserId ?? 0 })
  const { mutate: toggleFollow } = useToggleFollow({
    userId: authorId,
    profileUserId: authorId,
  })

  const isMe = currentUserId === authorId
  const isFollowing =
    followingList?.some((user) => user.userId === authorId) ?? false

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
        onClose()
      }, 3100)
      return () => clearTimeout(timer)
    }
  }, [showToast, onClose])

  const handleCopyLink = async () => {
    const postUrl = `${window.location.origin}/p/${postId}`
    try {
      await navigator.clipboard.writeText(postUrl)
      setShowToast(true)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeletePost = async () => {
    try {
      const response = await instance
        .delete(`api/v1/posts/${postId}`)
        .json<{ isSuccess: boolean; code: string; message: string }>()

      if (response.isSuccess) {
        onClose()
        // 삭제 후 내 프로필 페이지나 홈으로 이동
        navigate({ to: `/${authorId}` })
      }
    } catch (err) {
      console.error('게시글 삭제 실패:', err)
    }
  }

  if (activeModal === 'report') {
    return (
      <ReportModal
        onClose={onClose}
        nickname={nickname}
        onHideComment={() => {}}
        type="post"
      />
    )
  }

  if (activeModal === 'account') {
    return (
      <AccountInfoModal
        onClose={onClose}
        nickname={nickname}
        profileImageUrl={profileImageUrl}
      />
    )
  }

  if (activeModal === 'embed') {
    return <EmbedModal onClose={onClose} postId={postId} nickname={nickname} />
  }

  if (activeModal === 'delete_confirm') {
    return (
      <div
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-[400px] overflow-hidden rounded-[12px] bg-white text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-8 py-6">
            <h2 className="mb-2 text-[18px] font-bold text-black">
              게시물을 삭제할까요?
            </h2>
            <p className="text-[14px] text-gray-500">
              지금 삭제하면 이 게시물을 다시 볼 수 없습니다.
            </p>
          </div>
          <button
            onClick={handleDeletePost}
            className="w-full border-t border-gray-200 py-3 text-[14px] font-bold text-red-500 active:bg-gray-50"
          >
            삭제
          </button>
          <button
            onClick={() => setActiveModal('menu')}
            className="w-full border-t border-gray-200 py-3 text-[14px] active:bg-gray-50"
          >
            취소
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-[400px] overflow-hidden rounded-[12px] bg-white text-center text-[14px]"
          onClick={(e) => e.stopPropagation()}
        >
          {isMe ? (
            <>
              <button
                onClick={() => setActiveModal('delete_confirm')}
                className="w-full border-b border-gray-200 py-3 font-bold text-red-500 active:bg-gray-100"
              >
                삭제
              </button>
              <button className="w-full border-b border-gray-200 py-3 active:bg-gray-100">
                수정
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveModal('report')}
                className="w-full border-b border-gray-200 py-3 font-bold text-red-500 active:bg-gray-100"
              >
                신고
              </button>
              {isFollowing && (
                <button
                  onClick={() => {
                    toggleFollow()
                    onClose()
                  }}
                  className="w-full border-b border-gray-200 py-3 font-bold text-red-500 active:bg-gray-100"
                >
                  팔로우 취소
                </button>
              )}
              <button
                onClick={handleCopyLink}
                className="w-full border-b border-gray-200 py-3 active:bg-gray-100"
              >
                링크 복사
              </button>
              {!isFollowing && (
                <button
                  onClick={() => setActiveModal('embed')}
                  className="w-full border-b border-gray-200 py-3 active:bg-gray-100"
                >
                  퍼가기
                </button>
              )}
            </>
          )}

          <button
            onClick={() => setActiveModal('account')}
            className="w-full border-b border-gray-200 py-3 active:bg-gray-100"
          >
            이 계정 정보
          </button>
          <button onClick={onClose} className="w-full py-3 active:bg-gray-100">
            취소
          </button>
        </div>
      </div>

      {showToast && (
        <div
          style={{
            animation:
              'slideDoubleFast 3.1s cubic-bezier(0.1, 1, 0.1, 1) forwards',
          }}
          className="fixed bottom-0 left-0 z-[200] flex w-full bg-[#555555] px-4 py-2 shadow-2xl"
        >
          <style>{`@keyframes slideDoubleFast { 0% { transform: translateY(100%); } 2.5% { transform: translateY(0%); } 97.5% { transform: translateY(0%); } 100% { transform: translateY(100%); } }`}</style>
          <span className="block text-left text-[14px] font-medium text-white">
            링크를 클립보드에 복사했습니다.
          </span>
        </div>
      )}
    </>
  )
}
