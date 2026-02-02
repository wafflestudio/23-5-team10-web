import type { PropsWithChildren } from 'react'
import { ThemeProvider } from 'next-themes'
import { SidebarProvider } from '@/shared/ui/sidebar'
import { Toaster } from '@/shared/ui/sonner'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/shared/auth/AuthProvider'
import { queryClient } from '@/shared/api/queryClient'

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </AuthProvider>
        <Toaster duration={1500} className="text-center" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
