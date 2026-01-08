import type { PropsWithChildren } from 'react'

import { SidebarProvider } from '@/shared/ui/sidebar'

export function Providers({ children }: PropsWithChildren) {
  return <SidebarProvider>{children}</SidebarProvider>
}
