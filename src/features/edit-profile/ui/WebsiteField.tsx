import { Input } from '@/shared/ui/input'

type WebsiteFieldProps = {
  value?: string
}

export function WebsiteField({ value = '' }: WebsiteFieldProps) {
  return (
    <div className="flex cursor-not-allowed flex-col gap-2">
      <label className="text-base font-semibold text-gray-900">웹사이트</label>
      <Input
        value={value}
        placeholder="웹사이트"
        disabled
        className="rounded-xl border-gray-200 bg-gray-50 py-5"
      />
      <p className="text-sm text-gray-500">
        링크 수정은 모바일에서만 가능합니다. Instagram 앱으로 이동하여 프로필의
        소개에서 웹사이트를 변경하여 수정하세요.
      </p>
    </div>
  )
}
