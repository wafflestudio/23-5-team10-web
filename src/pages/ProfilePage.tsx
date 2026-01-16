import {
  Outlet,
  useMatchRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router'

import { ProfileHeader } from '@/widgets/profile-header/ui/ProfileHeader'
import {
  PROFILE_ROUTE_TAB_VALUE,
  ProfileRouteTabs,
  type ProfileRouteTabValue,
} from '@/widgets/profile-route-tabs'

export function ProfilePage() {
  const navigate = useNavigate()
  const matchRoute = useMatchRoute()
  const { profile_name } = useParams({ from: '/_app/$profile_name' })

  const isSavedTabSelected = Boolean(
    matchRoute({
      to: '/$profile_name/saved',
      params: { profile_name },
    })
  )

  const activeTabValue: ProfileRouteTabValue = isSavedTabSelected
    ? PROFILE_ROUTE_TAB_VALUE.SAVED
    : PROFILE_ROUTE_TAB_VALUE.POSTS

  const handleTabChange = (nextTab: ProfileRouteTabValue) => {
    if (nextTab === PROFILE_ROUTE_TAB_VALUE.POSTS) {
      navigate({
        to: '/$profile_name',
        params: { profile_name },
      })
      return
    }

    if (nextTab === PROFILE_ROUTE_TAB_VALUE.SAVED) {
      navigate({
        to: '/$profile_name/saved',
        params: { profile_name },
      })
    }
  }

  return (
    <div className="flex-1">
      <ProfileHeader
        nickname={profile_name}
        postsCount={0}
        followersCount={0}
        followingCount={0}
      />

      <ProfileRouteTabs
        value={activeTabValue}
        onValueChange={handleTabChange}
      />

      <Outlet />
    </div>
  )
}
