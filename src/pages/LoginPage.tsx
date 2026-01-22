import { useState } from 'react'
import LoginCard from '../components/auth/LoginCard'
import SignupCard from '../components/auth/SignupCard'
import LoginFooter from '../components/auth/LoginFooter'
import LoginVisual from '../components/auth/LoginVisual'
import LocationSelectView from '../components/auth/LocationSelectView'
import CitySelectView from '../components/auth/CitySelectView'

const LoginPage = () => {
  const [view, setView] = useState<'login' | 'location' | 'city'>('login')
  const [selectedCountry, setSelectedCountry] = useState('')

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country)
    setView('city')
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <main className="flex w-full flex-grow justify-center">
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
            onSelect={handleCountrySelect}
          />
        )}

        {view === 'city' && (
          <CitySelectView
            country={selectedCountry}
            onBack={() => setView('location')}
          />
        )}
      </main>
      <LoginFooter onLocationClick={() => setView('location')} />
    </div>
  )
}

export default LoginPage
