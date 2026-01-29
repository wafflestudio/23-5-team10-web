import { createFileRoute } from '@tanstack/react-router'
import { VerificationPage } from '@/features/auth/verification/main/ui'

interface VerificationSearch {
  email: string
  password?: string
  nickname?: string
  name?: string
  birthday?: string
}

export const Route = createFileRoute('/accounts/emailsignup/verification')({
  component: VerificationPage,
  validateSearch: (search: Record<string, unknown>): VerificationSearch => {
    return {
      email: (search.email as string) || '',
      password: (search.password as string) || '',
      nickname: (search.nickname as string) || '',
      name: (search.name as string) || '',
      birthday: (search.birthday as string) || '',
    }
  },
})
