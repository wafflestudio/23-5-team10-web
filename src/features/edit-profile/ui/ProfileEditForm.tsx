import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  useCurrentUser,
  useInvalidateCurrentUser,
} from '@/shared/auth/useCurrentUser'
import { cn } from '@/shared/lib/utils'
import { uploadImages } from '@/features/create-post/api/uploadImages'
import { updateProfile } from '../api/updateProfile'
import { ProfileEditCard } from './ProfileEditCard'
import { WebsiteField } from './WebsiteField'
import { BioTextarea } from './BioTextarea'
import { ChangePhotoModal } from './ChangePhotoModal'

export function ProfileEditForm() {
  const { data: currentUser } = useCurrentUser()
  const invalidateCurrentUser = useInvalidateCurrentUser()
  const [bio, setBio] = useState(currentUser?.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    currentUser?.profileImageUrl ?? null
  )
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const originalBio = currentUser?.bio ?? ''
  const originalAvatarUrl = currentUser?.profileImageUrl ?? null
  const hasChanges = bio !== originalBio || avatarUrl !== originalAvatarUrl

  const uploadMutation = useMutation({
    mutationFn: uploadImages,
    onSuccess: (urls) => {
      setAvatarUrl(urls[0])
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      invalidateCurrentUser()
      toast.success('프로필이 저장되었습니다.')
    },
    onError: () => {
      toast.error('프로필 저장에 실패했습니다.')
    },
  })

  const handleSubmit = () => {
    updateMutation.mutate({
      bio: bio || null,
      profileImageUrl: avatarUrl,
    })
  }

  const handleUploadPhoto = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadMutation.mutate([file])
    }
    e.target.value = ''
  }

  const handleDeletePhoto = () => {
    setAvatarUrl(null)
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="flex flex-col gap-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
      />

      <ChangePhotoModal
        open={isPhotoModalOpen}
        onOpenChange={setIsPhotoModalOpen}
        onUpload={handleUploadPhoto}
        onDelete={handleDeletePhoto}
      />

      <ProfileEditCard
        avatarUrl={avatarUrl}
        nickname={currentUser.nickname}
        name={currentUser.name}
        onChangePhotoClick={() => setIsPhotoModalOpen(true)}
      />

      <WebsiteField />

      <BioTextarea value={bio} onChange={setBio} />

      <p className="text-sm text-gray-500">
        회원님의 이름, 소개, 링크와 같은 특정 프로필 정보가 모든 사람에게
        공개됩니다.{' '}
        <a
          href="https://help.instagram.com/347751748650214?ref=igweb"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          공개되는 프로필 정보를 확인해보세요
        </a>
      </p>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!hasChanges || updateMutation.isPending}
          onClick={handleSubmit}
          className={cn(
            'w-1/2 rounded-xl py-3 text-sm font-semibold transition-colors',
            hasChanges
              ? 'cursor-pointer bg-blue-500 text-white hover:bg-blue-600'
              : 'cursor-default bg-blue-200 text-white'
          )}
        >
          제출
        </button>
      </div>
    </div>
  )
}
