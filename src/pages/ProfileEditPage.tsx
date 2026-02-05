import { ProfileEditForm } from '@/features/edit-profile'
import { AppFooter } from '@/shared/ui/app-footer'

export function ProfileEditPage() {
  return (
    <div className="flex flex-1 flex-col px-20 py-10 2xl:px-52">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-8 text-xl font-semibold text-gray-900">
          프로필 편집
        </h1>
        <ProfileEditForm />
      </div>
      <div className="mt-auto">
        <AppFooter />
      </div>
    </div>
  )
}
