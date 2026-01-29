import { createFileRoute, useNavigate } from '@tanstack/react-router'
import instagramLogo from '@/assets/instagram-logo.svg'
import { AppFooter } from '@/shared/ui/app-footer'
import { PasswordResetSection } from '@/features/auth/ui/password-reset-section'

export const Route = createFileRoute('/accounts/password/reset')({
  component: PasswordResetPage,
})

function PasswordResetPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-white">
      <div className="fixed top-0 left-0 z-50 flex h-[60px] w-full justify-center border-b border-gray-300 bg-white px-4">
        <div className="flex w-full max-w-[935px] items-center justify-between">
          <img
            src={instagramLogo}
            alt="Instagram"
            className="w-[103px] cursor-pointer"
            onClick={() => navigate({ to: '/login' })}
          />
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate({ to: '/login' })}
              className="rounded-[8px] bg-[#4a5df9] px-4 py-1.5 text-sm font-semibold text-white"
            >
              로그인
            </button>
            <button
              onClick={() => navigate({ to: '/accounts/emailsignup' })}
              className="text-sm font-semibold text-[#4a5df9]"
            >
              가입하기
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pt-[60px]">
        <div className="flex min-h-full items-center justify-center p-4">
          <PasswordResetSection />
        </div>
        <footer className="bg-white pb-8">
          <AppFooter
            onLocationClick={() => navigate({ to: '/explore/locations' })}
            onLiteClick={() => navigate({ to: '/web/lite' })}
          />
        </footer>
      </main>
    </div>
  )
}
