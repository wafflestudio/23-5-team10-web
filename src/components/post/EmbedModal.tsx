import { useState } from 'react'
import { X } from 'lucide-react'

interface EmbedModalProps {
  onClose: () => void
  postId: number
  nickname: string
}

export default function EmbedModal({
  onClose,
  postId,
  nickname,
}: EmbedModalProps) {
  const [isCopied, setIsCopied] = useState(false)

  const postUrl = `${window.location.origin}/posts/${postId}`

  const embedCode =
    `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="${postUrl}" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"><a href="${postUrl}" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"><div style=" display: flex; flex-direction: row; align-items: center;"><div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div><div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"><div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div><div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div><div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g transform="translate(512.000000, 21.000000)"><path d="M30,0 C13.458,0 0,13.458 0,30 C0,46.542 13.458,60 30,60 C46.542,60 60,46.542 60,30 C60,13.458 46.542,0 30,0 Z M30,55 C16.215,55 5,43.785 5,30 C5,16.215 16.215,5 30,5 C43.785,5 55,16.215 55,30 C55,43.785 43.785,55 30,55 Z"></path></g></g></g></svg></div><div style="padding-top: 8px;"><div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-weight:550; line-height:18px;">이 게시물 보기</div></div></a><p style=" margin:8px 0 0 0; padding:0 4px;"><a href="${postUrl}" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">${nickname}님의 공유 게시물</a></p></div></blockquote>`.trim()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setIsCopied(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">
      <div
        className="relative w-full max-w-[500px] overflow-hidden rounded-[24px] bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:opacity-60"
        >
          <X className="h-6 w-6 text-black" />
        </button>

        <div className="mt-6 mb-4">
          <div className="scrollbar-hide h-[72px] overflow-y-auto rounded border border-gray-200 bg-white p-3 font-mono text-[14px] leading-normal break-all text-black">
            {embedCode}
          </div>
        </div>

        <button
          onClick={handleCopy}
          disabled={isCopied}
          className={`w-full rounded-[12px] py-3 text-[16px] font-bold text-white transition-all ${
            isCopied
              ? 'bg-[#4a5df9]'
              : 'bg-[#4a5df9] hover:opacity-90 active:opacity-80'
          }`}
        >
          {isCopied ? '퍼가기 코드가 복사되었습니다' : 'Embed 태그 복사'}
        </button>

        <p className="mt-4 text-[13px] leading-tight text-gray-500">
          이 embed 태그를 사용하면 Instagram의{' '}
          <a
            href="https://help.instagram.com/581066165581870"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00376B]"
          >
            API 이용 약관
          </a>
          에 동의하게 됩니다.
        </p>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
