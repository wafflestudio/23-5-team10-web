import { ShieldCheck, Tv, User } from 'lucide-react'
import MetaLogo from '@/assets/Meta-Logo.png'

const menuItems = [
  { icon: User, label: '개인정보' },
  { icon: ShieldCheck, label: '비밀번호 및 보안' },
  { icon: Tv, label: '광고 기본 설정' },
]

export function MetaAccountCenter() {
  return (
    <button
      type="button"
      className="w-full cursor-pointer rounded-2xl bg-white p-6 text-left shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
    >
      <img src={MetaLogo} alt="Meta" className="mb-4 h-6" />

      <h2 className="mb-2 text-lg font-bold text-gray-900">계정 센터</h2>
      <p className="mb-4 text-sm text-gray-500">
        Meta 테크놀로지 전반에서 연결된 환경 및 계정 설정을 관리해보세요.
      </p>

      <ul className="mb-4 flex flex-col gap-3">
        {menuItems.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 text-sm text-gray-900"
          >
            <item.icon className="size-5 text-gray-600" />
            {item.label}
          </li>
        ))}
      </ul>

      <span className="text-sm font-medium text-blue-500">
        계정 센터에서 더 보기
      </span>
    </button>
  )
}
