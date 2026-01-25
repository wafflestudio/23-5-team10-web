import { createFileRoute, useNavigate } from '@tanstack/react-router'
import LocationSelectView from '@/components/auth/LocationSelectView'
import { useSmartBack } from '@/hooks/useSmartBack'

export const Route = createFileRoute('/explore/locations/')({
  component: LocationsPage,
})

function LocationsPage() {
  const navigate = useNavigate()
  const handleBack = useSmartBack()

  return (
    <LocationSelectView
      onBack={handleBack}
      onLoginClick={() => navigate({ to: '/login' })}
      onSignupClick={() => navigate({ to: '/accounts/emailsignup' })}
      onSelect={() => {
        navigate({
          to: '/explore/locations/$countryCode/$countryName',
          params: {
            countryCode: 'KR',
            countryName: 'south-korea',
          },
        })
      }}
    />
  )
}
