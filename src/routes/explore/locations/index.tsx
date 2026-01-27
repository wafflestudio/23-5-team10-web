import { createFileRoute, useNavigate } from '@tanstack/react-router'
import LocationSelectView from '@/components/auth/LocationSelectView'
import LoginFooter from '@/shared/ui/app-footer'
import { useSmartBack } from '@/hooks/useSmartBack'

export const Route = createFileRoute('/explore/locations/')({
  component: LocationsPage,
})

function LocationsPage() {
  const navigate = useNavigate()
  const handleBack = useSmartBack()

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <main className="flex-grow">
        <LocationSelectView
          onBack={handleBack}
          onLoginClick={() => navigate({ to: '/login' })}
          onSignupClick={() => navigate({ to: '/accounts/emailsignup' })}
          onSelect={() => {
            navigate({
              to: '/explore/locations/$countryCode/$countryName',
              params: {
                countryCode: 'KR',
                countryName: 'South Korea',
              },
            })
          }}
        />
      </main>
      <LoginFooter
        onLocationClick={() => navigate({ to: '/explore/locations' })}
        onLiteClick={() => navigate({ to: '/web/lite' })}
      />
    </div>
  )
}
