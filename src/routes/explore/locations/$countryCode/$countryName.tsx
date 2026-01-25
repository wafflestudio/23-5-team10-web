import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router'
import CitySelectView from '@/components/auth/CitySelectView'
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
    <CitySelectView
      country={countryName}
      onBack={handleBack}
      onLoginClick={() => navigate({ to: '/login' })}
      onSignupClick={() => navigate({ to: '/accounts/emailsignup' })}
    />
  )
}
