import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import type { CSSProperties } from 'react'

import { cn } from '@/shared/lib/utils'

const CENTERED_TOASTER_STYLE: CSSProperties = {
  top: '50%',
  left: '50%',
  right: 'auto',
  bottom: 'auto',
  transform: 'translate(-50%, -50%)',
}

const Toaster = ({ className, ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      {...props}
      theme={theme as ToasterProps['theme']}
      className={cn('toaster group', className)}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'rgb(0 0 0 / 0.5)',
          '--normal-text': 'white',
          '--normal-border': 'transparent',
          '--border-radius': '12px',
          ...CENTERED_TOASTER_STYLE,
        } as CSSProperties
      }
    />
  )
}

export { Toaster }
