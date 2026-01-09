import type { PropsWithChildren } from 'react'

import { ThemeProvider } from 'next-themes'

import { SidebarProvider } from '@/shared/ui/sidebar'
import { Toaster } from '@/shared/ui/sonner'

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>{children}</SidebarProvider>
      <Toaster duration={1500} className="text-center" />
    </ThemeProvider>
  )
}
