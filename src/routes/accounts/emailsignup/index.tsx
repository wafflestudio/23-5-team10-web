import { createFileRoute } from '@tanstack/react-router'
import { EmailSignupPage } from '@/features/auth/email-signup/ui'

export const Route = createFileRoute('/accounts/emailsignup/')({
  component: EmailSignupPage,
})
