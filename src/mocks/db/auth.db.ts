export interface MockAuth {
  loginId: string
  password: string
  userId: number
}

export const authUsers: MockAuth[] = [
  {
    loginId: 'admin@gmail.com',
    password: 'admin',
    userId: 1,
  },
  {
    loginId: 'user2@gmail.com',
    password: 'password123',
    userId: 2,
  },
  {
    loginId: 'user3@gmail.com',
    password: 'password123',
    userId: 3,
  },
  {
    loginId: 'user4@gmail.com',
    password: 'password123',
    userId: 4,
  },
  {
    loginId: 'user5@gmail.com',
    password: 'password123',
    userId: 5,
  },
]
