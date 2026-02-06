import { FileQuestion } from 'lucide-react'
import { Button } from '@/shared/ui/button'

type InvalidPageStateProps = {
  totalPages: number
  onGoToFirstPage: () => void
}

export function InvalidPageState({
  totalPages,
  onGoToFirstPage,
}: InvalidPageStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex size-20 items-center justify-center rounded-full border-2 border-black">
        <FileQuestion className="size-10" strokeWidth={1} />
      </div>
      <h2 className="mt-6 text-3xl font-extrabold">
        존재하지 않는 페이지입니다
      </h2>
      <p className="mt-3 text-center text-sm text-gray-500">
        요청하신 페이지를 찾을 수 없습니다.
        <br />
        전체 {totalPages}페이지 중 유효한 페이지로 이동해 주세요.
      </p>
      <Button onClick={onGoToFirstPage} className="mt-6">
        첫 페이지로 이동
      </Button>
    </div>
  )
}
