import { numberFormat } from '@/shared/lib/numberFormat'

type ProfileStatProps = {
  label: string
  value: number
}

export function ProfileStat({ label, value }: ProfileStatProps) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="font-semibold text-gray-900">{numberFormat(value)}</span>
      <span className="text-gray-600">{label}</span>
    </div>
  )
}
