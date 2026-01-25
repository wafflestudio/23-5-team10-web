import { useNavigate } from '@tanstack/react-router'
import LoginCard from '../components/auth/LoginCard'
import SignupCard from '../components/auth/SignupCard'
import LoginFooter from '../components/auth/LoginFooter'
import LoginVisual from '../components/auth/LoginVisual'

const LoginPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <main className="flex flex-grow items-start justify-center">
        <div className="flex w-full max-w-[935px] flex-row items-center justify-center gap-8 px-4 pt-12 pb-8">
          <LoginVisual />
          <div className="flex w-full max-w-[350px] flex-col gap-2">
            <LoginCard />
            <SignupCard />
          </div>
        </div>
      </main>
      <LoginFooter
        onLocationClick={() => navigate({ to: '/explore/locations' })}
        onLiteClick={() => navigate({ to: '/web/lite' })}
      />
    </div>
  )
}

export default LoginPage
