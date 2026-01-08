import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/password/reset')({
  component: () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <h1 className="mb-4 text-2xl font-bold">비밀번호 재설정</h1>
      <p className="text-gray-600">
        이메일 또는 사용자 이름을 입력하여 계정을 찾으세요.
      </p>
    </div>
  ),
})
