import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/accounts/emailsignup')({
  component: () => (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">회원가입 페이지</h1>
    </div>
  ),
})
