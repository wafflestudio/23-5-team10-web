import { createFileRoute, useNavigate } from '@tanstack/react-router'
import LiteDownloadView from '@/components/auth/LiteDownloadView'
import LoginFooter from '@/shared/ui/app-footer'
import { useSmartBack } from '@/hooks/useSmartBack'

export const Route = createFileRoute('/web/lite')({
  component: LitePage,
})

function LitePage() {
  const navigate = useNavigate()
  const handleBack = useSmartBack()

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <main className="flex-grow">
        <LiteDownloadView onBack={handleBack} />
      </main>
      <LoginFooter
        onLocationClick={() => navigate({ to: '/explore/locations' })}
        onLiteClick={() => navigate({ to: '/web/lite' })}
      />
    </div>
  )
}
