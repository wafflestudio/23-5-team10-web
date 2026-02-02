import {
  Outlet,
  useMatchRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router'

import { useToggleFollow } from '@/features/follow-user/model/useToggleFollow'
import { ProfileHeader } from '@/widgets/profile-header/ui/ProfileHeader'
import {
  PROFILE_ROUTE_TAB_VALUE,
  ProfileRouteTabs,
  type ProfileRouteTabValue,
} from '@/widgets/profile-route-tabs'
import { useProfile } from '@/entities/user/model/hooks/useProfile'

export function ProfilePage() {
  const navigate = useNavigate()
  const matchRoute = useMatchRoute()
  const { userId } = useParams({ from: '/_app/$userId' })
  const numericUserId = Number(userId)

  const { data: profile, isLoading } = useProfile(numericUserId)
  const { mutateAsync: toggleFollow } = useToggleFollow({
    userId: numericUserId,
  })

  const handleFollowToggle = async () => {
    await toggleFollow()
  }

  const isAlbumsTabSelected = Boolean(
    matchRoute({
      to: '/$userId/albums',
      params: { userId },
    })
  )

  const isSavedTabSelected = Boolean(
    matchRoute({
      to: '/$userId/saved',
      params: { userId },
    })
  )

  const activeTabValue: ProfileRouteTabValue = isSavedTabSelected
    ? PROFILE_ROUTE_TAB_VALUE.SAVED
    : isAlbumsTabSelected
      ? PROFILE_ROUTE_TAB_VALUE.ALBUMS
      : PROFILE_ROUTE_TAB_VALUE.POSTS

  const handleTabChange = (nextTab: ProfileRouteTabValue) => {
    if (nextTab === PROFILE_ROUTE_TAB_VALUE.POSTS) {
      navigate({
        to: '/$userId',
        params: { userId },
      })
      return
    }

    if (nextTab === PROFILE_ROUTE_TAB_VALUE.ALBUMS) {
      navigate({
        to: '/$userId/albums',
        params: { userId },
      })
      return
    }

    if (nextTab === PROFILE_ROUTE_TAB_VALUE.SAVED) {
      navigate({
        to: '/$userId/saved',
        params: { userId },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="text-sm text-gray-500">로딩 중...</span>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="text-sm text-gray-500">
          사용자를 찾을 수 없습니다.
        </span>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <ProfileHeader
        userId={numericUserId}
        nickname={profile.nickname}
        avatarUrl={profile.profileImageUrl}
        bio={profile.bio}
        postsCount={profile.postsCount}
        followersCount={profile.followerCount}
        followingCount={profile.followingCount}
        defaultIsFollowing={profile.isFollowed}
        onFollowToggle={handleFollowToggle}
      />

      <ProfileRouteTabs
        value={activeTabValue}
        onValueChange={handleTabChange}
        showSavedTab={profile.me}
      />

      <Outlet />
    </div>
  )
}
