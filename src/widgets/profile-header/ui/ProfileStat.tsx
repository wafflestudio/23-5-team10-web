import { numberFormat } from '@/shared/lib/numberFormat'
import { cn } from '@/shared/lib/utils'

type ProfileStatProps = {
  label: string
  value: number
  onClick?: () => void
  className?: string
}

export function ProfileStat({
  label,
  value,
  onClick,
  className,
}: ProfileStatProps) {
  return (
    <div
      className={cn('flex items-baseline gap-1', className)}
      onClick={onClick}
    >
      <span className="font-semibold text-gray-900">{numberFormat(value)}</span>
      <span className="text-gray-600">{label}</span>
    </div>
  )
}
