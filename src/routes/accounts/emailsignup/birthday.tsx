import { createFileRoute, redirect } from '@tanstack/react-router'
import { BirthdayPage } from '@/features/auth/birthday/ui'

interface SignupSearch {
  email: string
  password: string
  nickname: string
  name?: string
}

export const Route = createFileRoute('/accounts/emailsignup/birthday')({
  validateSearch: (search: Record<string, unknown>): SignupSearch => {
    return {
      email: (search.email as string) || '',
      password: (search.password as string) || '',
      nickname: (search.nickname as string) || '',
      name: (search.name as string) || '',
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
  component: BirthdayPage,
})
