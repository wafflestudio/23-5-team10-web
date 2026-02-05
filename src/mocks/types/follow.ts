import type { ApiResponse } from '@/mocks/types/common'

export interface FollowUser {
  userId: number
  nickname: string
  profileImageUrl: string | null
  isFollowing: boolean
}

export type FollowerListResponse = ApiResponse<FollowUser[]>
export type FollowingListResponse = ApiResponse<FollowUser[]>

export interface FollowActionResult {
  toUserId: number
  following: boolean
}

export type FollowActionResponse = ApiResponse<void>
export type DeleteFollowResponse = ApiResponse<void>

export interface FollowRelation {
  fromUserId: number
  toUserId: number
}
