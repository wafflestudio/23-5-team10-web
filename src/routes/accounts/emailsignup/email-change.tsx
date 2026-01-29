import { createFileRoute } from '@tanstack/react-router'
import { EmailChangePage } from '@/features/auth/verification/email-change/ui'

interface EmailChangeSearch {
  email: string
}

export const Route = createFileRoute('/accounts/emailsignup/email-change')({
  component: EmailChangePage,
  validateSearch: (search: Record<string, unknown>): EmailChangeSearch => {
    return {
      email: (search.email as string) || '',
    }
  },
})
