interface AccountInfoModalProps {
  onClose: () => void
  nickname: string
  profileImageUrl: string | null
}

export default function AccountInfoModal({
  onClose,
  nickname,
  profileImageUrl,
}: AccountInfoModalProps) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">
      <div
        className="w-full max-w-[400px] overflow-hidden rounded-[12px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 py-3 text-center font-bold">
          이 계정 정보
        </div>

        <div className="flex flex-col items-center p-8">
          <div className="mb-4 h-20 w-20 overflow-hidden rounded-full bg-gray-100">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={nickname}
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src="/default-profile.png"
                alt="기본 프로필"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <h2 className="text-[16px] font-bold">{nickname}</h2>
          <p className="mt-4 px-4 text-center text-[12px] leading-normal text-gray-500">
            신뢰할 수 있는 커뮤니티를 유지하기 위해 Instagram 계정에 대한 정보가
            표시됩니다.{' '}
            <a
              href="https://help.instagram.com/697961817256175"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#00376B] hover:underline"
            >
              이 정보가 중요한 이유를 확인해보세요.
            </a>
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full border-t border-gray-200 py-4 font-semibold active:bg-gray-100"
        >
          닫기
        </button>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
