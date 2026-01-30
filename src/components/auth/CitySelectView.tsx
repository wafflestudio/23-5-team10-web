import instagramLogo from '../../assets/instagram-logo.svg'
import pinIcon from '../../assets/pin.png'
import { CITIES } from '../../constants/cities'

interface CitySelectViewProps {
  country: string
  onLoginClick: () => void
  onSignupClick: () => void
  onHomeClick: () => void
}

const CitySelectView = ({
  country,
  onLoginClick,
  onSignupClick,
  onHomeClick,
}: CitySelectViewProps) => {
  const displayCountry = country === 'south-korea' ? 'South Korea' : country

  return (
    <div className="flex w-full flex-col items-center">
      <div className="fixed top-0 left-0 z-50 flex h-[60px] w-full justify-center border-b border-gray-300 bg-white px-4">
        <div className="flex w-full max-w-[935px] items-center justify-between">
          <img
            src={instagramLogo}
            alt="Instagram"
            className="w-[103px] cursor-pointer"
            onClick={onHomeClick}
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
        <div className="mb-[53px] flex items-center gap-2">
          <img
            src={pinIcon}
            alt="Location"
            className="h-4 w-4 object-contain"
          />
          <span className="text-[16px] leading-none font-bold text-black">
            {displayCountry}
          </span>
        </div>

        <div className="mb-5 text-left">
          <span className="text-[14px] font-bold text-[#737373] uppercase">
            {displayCountry}의 도시
          </span>
        </div>

        <div className="flex flex-col rounded-[3px] border border-gray-300 bg-white shadow-sm">
          <div className="p-8">
            <div className="columns-4 gap-x-8">
              {CITIES.map((city, index) => (
                <div
                  key={`${city}-${index}`}
                  className="mb-1 min-h-[1.25rem] cursor-pointer break-inside-avoid truncate text-[14px] text-black active:text-[#4a5df9]"
                >
                  {city || '\u00A0'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CitySelectView
