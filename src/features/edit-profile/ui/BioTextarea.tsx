import { Textarea } from '@/shared/ui/textarea'

type BioTextareaProps = {
  value: string
  onChange: (value: string) => void
  maxLength?: number
}

const DEFAULT_MAX_LENGTH = 255

export function BioTextarea({
  value,
  onChange,
  maxLength = DEFAULT_MAX_LENGTH,
}: BioTextareaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (newValue.length <= maxLength) {
      onChange(newValue)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-semibold text-gray-900">소개</label>
      <div className="relative">
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder="소개"
          className="min-h-[80px] resize-none rounded-xl border-gray-200 bg-gray-50 pr-16"
        />
        <span className="absolute right-3 bottom-3 text-sm text-gray-400">
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  )
}
