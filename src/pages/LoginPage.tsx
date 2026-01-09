import LoginCard from '../components/auth/LoginCard'
import SignupCard from '../components/auth/SignupCard'
import LoginFooter from '../components/auth/LoginFooter'
import LoginVisual from '../components/auth/LoginVisual'

const LoginPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <main className="flex w-full flex-grow items-center justify-center py-12">
        <div className="flex w-full max-w-[935px] flex-row items-center justify-center gap-8">
          <LoginVisual />

          <div className="flex w-full max-w-[350px] flex-col gap-2">
            <LoginCard />
            <SignupCard />
          </div>
        </div>
      </main>
      <LoginFooter />
    </div>
  )
}

export default LoginPage
