export interface MockUser {
  userId: number
  nickname: string
  profileImageUrl: string
}

export const users: MockUser[] = [
  { userId: 1, nickname: 'me', profileImageUrl: 'https://picsum.photos/200' },
  {
    userId: 2,
    nickname: 'alice',
    profileImageUrl: 'https://picsum.photos/200',
  },
  { userId: 3, nickname: 'bob', profileImageUrl: 'https://picsum.photos/200' },
  {
    userId: 4,
    nickname: 'charlie',
    profileImageUrl: 'https://picsum.photos/200',
  },
  {
    userId: 5,
    nickname: 'celebrity',
    profileImageUrl: 'https://picsum.photos/200',
  },
]
