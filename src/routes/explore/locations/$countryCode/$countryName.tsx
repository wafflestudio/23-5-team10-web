import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router'
import CitySelectView from '@/components/auth/CitySelectView'
import { AppFooter } from '@/shared/ui/app-footer'

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

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <main className="flex-grow">
        <CitySelectView
          country={countryName}
          onHomeClick={() => navigate({ to: '/login' })}
          onLoginClick={() => navigate({ to: '/login' })}
          onSignupClick={() => navigate({ to: '/accounts/emailsignup' })}
        />
      </main>
      <AppFooter
        onLocationClick={() => navigate({ to: '/explore/locations' })}
        onLiteClick={() => navigate({ to: '/web/lite' })}
      />
    </div>
  )
}
