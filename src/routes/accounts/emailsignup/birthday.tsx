import { createFileRoute } from '@tanstack/react-router'
import { BirthdayPage } from '@/features/auth/birthday/ui'

interface SignupSearch {
  email?: string
  password?: string
  name?: string
  nickname?: string
}

export const Route = createFileRoute('/accounts/emailsignup/birthday')({
  validateSearch: (search: Record<string, unknown>): SignupSearch => {
    return {
      email: (search.email as string) || '',
      password: (search.password as string) || '',
      name: (search.name as string) || '',
      nickname: (search.nickname as string) || '',
    }
  },
  component: BirthdayPage,
})
