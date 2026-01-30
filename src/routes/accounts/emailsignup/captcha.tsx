import { createFileRoute, redirect } from '@tanstack/react-router'
import { CaptchaPage } from '@/features/auth/captcha/ui'

interface CaptchaSearch {
  email: string
  name: string
  nickname: string
  password: string
  birthday: string
}

export const Route = createFileRoute('/accounts/emailsignup/captcha')({
  validateSearch: (search: Record<string, unknown>): CaptchaSearch => {
    return {
      email: (search.email as string) || '',
      name: (search.name as string) || '',
      nickname: (search.nickname as string) || '',
      password: (search.password as string) || '',
      birthday: (search.birthday as string) || '',
    }
  },
  beforeLoad: ({ search }) => {
    if (
      !search.email ||
      !search.password ||
      !search.nickname ||
      !search.name ||
      !search.birthday
    ) {
      throw redirect({
        to: '/accounts/emailsignup',
        replace: true,
      })
    }
  },
  component: CaptchaPage,
})
