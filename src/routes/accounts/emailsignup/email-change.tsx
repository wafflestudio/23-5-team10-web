import { createFileRoute, redirect } from '@tanstack/react-router'
import { EmailChangePage } from '@/features/auth/verification/email-change/ui'

interface EmailChangeSearch {
  email: string
  password: string
  nickname: string
  name?: string
  birthday?: string
}

export const Route = createFileRoute('/accounts/emailsignup/email-change')({
  validateSearch: (search: Record<string, unknown>): EmailChangeSearch => {
    return {
      email: (search.email as string) || '',
      password: (search.password as string) || '',
      nickname: (search.nickname as string) || '',
      name: (search.name as string) || '',
      birthday: (search.birthday as string) || '',
    }
  },
  beforeLoad: ({ search }) => {
    if (!search.email || !search.password || !search.nickname) {
      throw redirect({
        to: '/accounts/emailsignup',
        replace: true,
      })
    }
  },
  component: EmailChangePage,
})
