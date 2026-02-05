import { users } from '../db/user.db'
import { follows } from '../db/follow.db'
import { MOCK_USER_ID } from '../db/session.db'
import type { FollowUser } from '../types/follow'

export function toFollowUser(targetUserId: number): FollowUser {
  const user = users.find((u) => u.userId === targetUserId)

  if (!user) {
    throw new Error(`User ${targetUserId} not found`)
  }

  return {
    userId: user.userId,
    nickname: user.nickname,
    profileImageUrl: user.profileImageUrl,
    isFollowing: follows.some(
      (f) => f.fromUserId === MOCK_USER_ID && f.toUserId === targetUserId
    ),
  }
}
