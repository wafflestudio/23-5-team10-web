export interface Post {
  id: string
  imageUrl: string
  caption: string
  username: string
  userImage: string
  createdAt: string
  likeCount: number
  commentCount: number
}

export const posts: Post[] = [
  {
    id: '1',
    imageUrl: 'https://picsum.photos/id/10/800/800',
    caption: '첫 번째 게시물 테스트입니다.',
    username: 'test_user',
    userImage: 'https://picsum.photos/id/64/50/50',
    createdAt: '2024-03-20T10:00:00Z',
    likeCount: 120,
    commentCount: 8,
  },
  {
    id: '2',
    imageUrl: 'https://picsum.photos/id/20/800/800',
    caption: '두 번째 게시물 샘플 데이터입니다.',
    username: 'sample_fan',
    userImage: 'https://picsum.photos/id/65/50/50',
    createdAt: '2024-03-21T15:00:00Z',
    likeCount: 45,
    commentCount: 2,
  },
]
