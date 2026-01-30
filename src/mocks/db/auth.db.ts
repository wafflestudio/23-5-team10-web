export interface MockAuth {
  userId: number
  email: string
  password: string
  nickname: string
}

export const authDb: MockAuth[] = [
  {
    userId: 1,
    email: 'admin@gmail.com',
    password: 'password123',
    nickname: 'me',
  },
  {
    userId: 2,
    email: 'alice@gmail.com',
    password: 'password123',
    nickname: 'alice',
  },
  {
    userId: 3,
    email: 'bob@gmail.com',
    password: 'password123',
    nickname: 'bob',
  },
  {
    userId: 4,
    email: 'charlie@gmail.com',
    password: 'password123',
    nickname: 'charlie',
  },
  {
    userId: 5,
    email: 'celebrity@gmail.com',
    password: 'password123',
    nickname: 'celebrity',
  },
]
