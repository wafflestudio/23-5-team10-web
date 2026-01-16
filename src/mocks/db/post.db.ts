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

export const posts = [
  {
    id: '1',
    images: [
      'https://picsum.photos/id/10/800/800',
      'https://picsum.photos/id/11/800/800',
      'https://picsum.photos/id/12/800/800',
    ],
    caption: '여러 장의 사진 테스트입니다.',
    username: 'test_user',
    userImage: 'https://picsum.photos/id/64/50/50',
    createdAt: '2024-03-20T10:00:00Z',
    likeCount: 120,
    commentCount: 8,
  },
]
