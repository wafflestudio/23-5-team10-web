import { type FollowRelation } from '../types/follow'

export const follows: FollowRelation[] = [
  { fromUserId: 1, toUserId: 2 },
  { fromUserId: 1, toUserId: 3 },
  { fromUserId: 1, toUserId: 4 },
  { fromUserId: 2, toUserId: 1 },
  { fromUserId: 2, toUserId: 3 },
  { fromUserId: 3, toUserId: 1 },
  { fromUserId: 4, toUserId: 1 },
  { fromUserId: 4, toUserId: 2 },
  { fromUserId: 5, toUserId: 1 },
  { fromUserId: 5, toUserId: 6 },
  { fromUserId: 6, toUserId: 5 },
  { fromUserId: 7, toUserId: 1 },
  { fromUserId: 8, toUserId: 1 },
  { fromUserId: 9, toUserId: 1 },
  { fromUserId: 10, toUserId: 1 },
]
