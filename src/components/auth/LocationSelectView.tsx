import instagramLogo from '../../assets/instagram-logo.svg'
import { COUNTRIES } from '../../constants/countries'

interface LocationSelectViewProps {
  onLoginClick: () => void
  onSignupClick: () => void
  onSelect: (country: string) => void
}

const LocationSelectView = ({
  onLoginClick,
  onSignupClick,
  onSelect,
}: LocationSelectViewProps) => {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="fixed top-0 left-0 z-50 flex h-[60px] w-full justify-center border-b border-gray-300 bg-white px-4">
        <div className="flex w-full max-w-[935px] items-center justify-between">
          <img
            src={instagramLogo}
            alt="Instagram"
            className="w-[103px] cursor-pointer"
            onClick={onLoginClick}
          />
          <div className="flex items-center gap-4">
            <button
              onClick={onLoginClick}
              className="rounded-[8px] bg-[#4a5df9] px-4 py-1.5 text-sm font-semibold text-white"
            >
              로그인
            </button>
            <button
              onClick={onSignupClick}
              className="text-sm font-semibold text-[#4a5df9]"
            >
              가입하기
            </button>
          </div>
        </div>
      </div>

      <div className="mt-32 mb-12 flex w-11/24 flex-col">
        <div className="mb-2 ml-1 text-left">
          <span className="text-[14px] font-bold text-[#737373]">국가</span>
        </div>
        <div className="flex flex-col rounded-[3px] border border-gray-300 bg-white shadow-sm">
          <div className="p-8">
            <div className="grid grid-cols-4 gap-x-8 gap-y-5">
              {COUNTRIES.map((country) => (
                <div
                  key={country}
                  onClick={() => onSelect(country)}
                  className="cursor-pointer truncate text-[14px] text-black active:text-[#4a5df9]"
                >
                  {country}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationSelectView
