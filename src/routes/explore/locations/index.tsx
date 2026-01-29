import { createFileRoute, useNavigate } from '@tanstack/react-router'
import LocationSelectView from '@/components/auth/LocationSelectView'
import { AppFooter } from '@/shared/ui/app-footer'

export const Route = createFileRoute('/explore/locations/')({
  component: LocationsPage,
})

function LocationsPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <main className="flex-grow">
        <LocationSelectView
          onHomeClick={() => navigate({ to: '/login' })}
          onLoginClick={() => navigate({ to: '/login' })}
          onSignupClick={() => navigate({ to: '/accounts/emailsignup' })}
          onSelect={(country) => {
            navigate({
              to: '/explore/locations/$countryCode/$countryName',
              params: {
                countryCode: country === 'South Korea' ? 'KR' : 'US',
                countryName: country.toLowerCase().replace(/\s/g, '-'),
              },
            })
          }}
        />
      </main>
      <footer className="bg-white pb-8">
        <AppFooter
          onLocationClick={() => navigate({ to: '/explore/locations' })}
          onLiteClick={() => navigate({ to: '/web/lite' })}
        />
      </footer>
    </div>
  )
}
