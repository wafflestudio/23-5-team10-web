import { useState } from 'react'
import LoginCard from '../components/auth/LoginCard'
import SignupCard from '../components/auth/SignupCard'
import LoginFooter from '../components/auth/LoginFooter'
import LoginVisual from '../components/auth/LoginVisual'
import LocationSelectView from '../components/auth/LocationSelectView'
import CitySelectView from '../components/auth/CitySelectView'
import LiteDownloadView from '../components/auth/LiteDownloadView'

const LoginPage = () => {
  const [view, setView] = useState<'login' | 'location' | 'city' | 'lite'>(
    'login'
  )
  const [selectedCountry, setSelectedCountry] = useState('')

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <main className="flex w-full flex-grow items-start justify-center">
        {view === 'login' && (
          <div className="flex w-full max-w-[935px] flex-row items-center justify-center gap-8 px-4 pt-32">
            <LoginVisual />
            <div className="flex w-full max-w-[350px] flex-col gap-2">
              <LoginCard />
              <SignupCard />
            </div>
          </div>
        )}

        {view === 'location' && (
          <LocationSelectView
            onBack={() => setView('login')}
            onSelect={(country) => {
              setSelectedCountry(country)
              setView('city')
            }}
          />
        )}

        {view === 'city' && (
          <CitySelectView
            country={selectedCountry}
            onBack={() => setView('location')}
          />
        )}

        {view === 'lite' && (
          <LiteDownloadView onBack={() => setView('login')} />
        )}
      </main>
      <LoginFooter
        onLocationClick={() => setView('location')}
        onLiteClick={() => setView('lite')}
      />
    </div>
  )
}

export default LoginPage
