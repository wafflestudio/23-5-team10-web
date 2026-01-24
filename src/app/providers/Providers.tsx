import type { PropsWithChildren } from 'react'

import { ThemeProvider } from 'next-themes'

import { SidebarProvider } from '@/shared/ui/sidebar'
import { Toaster } from '@/shared/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SidebarProvider>{children}</SidebarProvider>
        <Toaster duration={1500} className="text-center" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
