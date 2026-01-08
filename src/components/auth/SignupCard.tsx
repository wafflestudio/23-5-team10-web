const SignupCard = () => {
  return (
    <div className="flex w-full items-center justify-center bg-white p-6">
      <p className="text-sm text-gray-800">
        계정이 없으신가요?{' '}
        <span className="cursor-pointer font-semibold text-[#0095f6] hover:underline">
          가입하기
        </span>
      </p>
    </div>
  )
}

export default SignupCard
