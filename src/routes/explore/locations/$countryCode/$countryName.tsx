import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router'
import CitySelectView from '@/components/auth/CitySelectView'
import LoginFooter from '@/shared/ui/app-footer'
import { useSmartBack } from '@/hooks/useSmartBack'

export const Route = createFileRoute(
  '/explore/locations/$countryCode/$countryName'
)({
  component: CityPage,
})

function CityPage() {
  const { countryName } = useParams({
    from: '/explore/locations/$countryCode/$countryName',
  })
  const navigate = useNavigate()
  const handleBack = useSmartBack()

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <main className="flex-grow">
        <CitySelectView
          country={countryName}
          onBack={handleBack}
          onLoginClick={() => navigate({ to: '/login' })}
          onSignupClick={() => navigate({ to: '/accounts/emailsignup' })}
        />
      </main>
      <LoginFooter
        onLocationClick={() => navigate({ to: '/explore/locations' })}
        onLiteClick={() => navigate({ to: '/web/lite' })}
      />
    </div>
  )
}
