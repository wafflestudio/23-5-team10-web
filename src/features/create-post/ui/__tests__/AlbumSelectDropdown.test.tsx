import {
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  vi,
} from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AlbumSelectDropdown } from '../AlbumSelectDropdown'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { handlers } from '@/mocks/handlers'

const server = setupServer(...handlers)

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterAll(() => {
  server.close()
})

beforeEach(() => {
  server.resetHandlers()
})

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

function renderWithProviders(
  component: React.ReactElement,
  queryClient?: QueryClient
) {
  const client = queryClient || createTestQueryClient()
  return {
    ...render(
      <QueryClientProvider client={client}>{component}</QueryClientProvider>
    ),
    queryClient: client,
  }
}

describe('AlbumSelectDropdown', () => {
  const mockOnSelect = vi.fn()

  beforeEach(() => {
    mockOnSelect.mockClear()
  })

  describe('초기 렌더링', () => {
    it('앨범이 선택되지 않았을 때 "앨범 없음"을 표시한다', async () => {
      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={-1} onSelect={mockOnSelect} />
      )

      const trigger = screen.getByRole('button', { name: /앨범 없음/i })
      expect(trigger).toBeInTheDocument()
    })

    it('앨범이 선택되었을 때 해당 앨범 제목을 표시한다', async () => {
      const queryClient = createTestQueryClient()

      server.use(
        http.get('*/api/v1/albums/users/*', () => {
          return HttpResponse.json(
            {
              code: '200',
              message: 'Success',
              isSuccess: true,
              data: [
                {
                  albumId: 1,
                  title: '여행 앨범',
                  thumbnailImageUrl: '',
                  postCount: 0,
                },
                {
                  albumId: 2,
                  title: '음식 앨범',
                  thumbnailImageUrl: '',
                  postCount: 0,
                },
              ],
            },
            { status: 200 }
          )
        })
      )

      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={1} onSelect={mockOnSelect} />,
        queryClient
      )

      await waitFor(
        () => {
          const trigger = screen.getByRole('button')
          expect(trigger).toHaveTextContent('여행 앨범')
        },
        { timeout: 3000 }
      )
    })
  })

  describe('드롭다운 열기/닫기', () => {
    it('트리거 버튼을 클릭하면 드롭다운이 열린다', async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={-1} onSelect={mockOnSelect} />
      )

      const trigger = screen.getByRole('button', { name: /앨범 없음/i })
      await user.click(trigger)

      await waitFor(() => {
        expect(
          screen.getByRole('menuitemradio', { name: /앨범 없음/i })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('menuitemradio', { name: /앨범 추가/i })
        ).toBeInTheDocument()
      })
    })
  })

  describe('앨범 선택', () => {
    it('"앨범 없음"을 선택하면 onSelect(-1)이 호출된다', async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={-1} onSelect={mockOnSelect} />
      )

      const trigger = screen.getByRole('button', { name: /앨범 없음/i })
      await user.click(trigger)

      await waitFor(() => {
        expect(
          screen.getByRole('menuitemradio', { name: /앨범 없음/i })
        ).toBeInTheDocument()
      })

      const noAlbumItem = screen.getByRole('menuitemradio', {
        name: /앨범 없음/i,
      })
      await user.click(noAlbumItem)

      expect(mockOnSelect).toHaveBeenCalledWith(-1)
    })

    it('기존 앨범을 선택하면 onSelect(albumId)가 호출된다', async () => {
      const user = userEvent.setup()
      const queryClient = createTestQueryClient()

      server.use(
        http.get('*/api/v1/albums/users/*', () => {
          return HttpResponse.json(
            {
              code: '200',
              message: 'Success',
              isSuccess: true,
              data: [
                {
                  albumId: 1,
                  title: '여행 앨범',
                  thumbnailImageUrl: '',
                  postCount: 0,
                },
                {
                  albumId: 2,
                  title: '음식 앨범',
                  thumbnailImageUrl: '',
                  postCount: 0,
                },
              ],
            },
            { status: 200 }
          )
        })
      )

      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={-1} onSelect={mockOnSelect} />,
        queryClient
      )

      const trigger = screen.getByRole('button', { name: /앨범 없음/i })
      await user.click(trigger)

      await waitFor(
        () => {
          expect(
            screen.getByRole('menuitemradio', { name: /여행 앨범/i })
          ).toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      const albumItem = screen.getByRole('menuitemradio', {
        name: /여행 앨범/i,
      })
      await user.click(albumItem)

      expect(mockOnSelect).toHaveBeenCalledWith(1)
    })
  })

  describe('앨범 추가', () => {
    it('"앨범 추가" 버튼을 클릭하면 input 필드가 나타난다', async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={-1} onSelect={mockOnSelect} />
      )

      const trigger = screen.getByRole('button', { name: /앨범 없음/i })
      await user.click(trigger)

      await waitFor(() => {
        expect(
          screen.getByRole('menuitemradio', { name: /앨범 추가/i })
        ).toBeInTheDocument()
      })

      const addButton = screen.getByRole('menuitemradio', {
        name: /앨범 추가/i,
      })
      await user.click(addButton)

      await waitFor(() => {
        const input = screen.getByPlaceholderText('앨범 제목 입력...')
        expect(input).toBeInTheDocument()
        expect(input).toHaveFocus()
      })

      expect(
        screen.getByRole('menuitemradio', { name: /앨범 없음/i })
      ).toBeInTheDocument()
    })

    it('input에 제목을 입력하고 Enter를 누르면 앨범이 생성된다', async () => {
      const user = userEvent.setup()
      const queryClient = createTestQueryClient()

      server.use(
        http.get('*/api/v1/albums/users/*', () => {
          return HttpResponse.json({
            code: '200',
            message: 'Success',
            isSuccess: true,
            data: [],
          })
        }),
        http.post('*/api/v1/albums', async () => {
          return HttpResponse.json({
            code: '200',
            message: 'Success',
            isSuccess: true,
            data: 3,
          })
        })
      )

      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={-1} onSelect={mockOnSelect} />,
        queryClient
      )

      const trigger = screen.getByRole('button', { name: /앨범 없음/i })
      await user.click(trigger)

      await waitFor(() => {
        expect(
          screen.getByRole('menuitemradio', { name: /앨범 추가/i })
        ).toBeInTheDocument()
      })

      const addButton = screen.getByRole('menuitemradio', {
        name: /앨범 추가/i,
      })
      await user.click(addButton)

      await waitFor(() => {
        const input = screen.getByPlaceholderText('앨범 제목 입력...')
        expect(input).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText('앨범 제목 입력...')
      await user.type(input, '새 앨범')
      await user.keyboard('{Enter}')

      await waitFor(
        () => {
          expect(
            screen.queryByPlaceholderText('앨범 제목 입력...')
          ).not.toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      expect(
        screen.getByRole('menuitemradio', { name: /앨범 없음/i })
      ).toBeInTheDocument()
    })

    it('input에 제목을 입력하고 체크 버튼을 클릭하면 앨범이 생성된다', async () => {
      const user = userEvent.setup()
      const queryClient = createTestQueryClient()

      server.use(
        http.get('*/api/v1/albums/users/*', () => {
          return HttpResponse.json({
            code: '200',
            message: 'Success',
            isSuccess: true,
            data: [],
          })
        }),
        http.post('*/api/v1/albums', async () => {
          return HttpResponse.json({
            code: '200',
            message: 'Success',
            isSuccess: true,
            data: 3,
          })
        })
      )

      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={-1} onSelect={mockOnSelect} />,
        queryClient
      )

      const trigger = screen.getByRole('button', { name: /앨범 없음/i })
      await user.click(trigger)

      await waitFor(() => {
        expect(
          screen.getByRole('menuitemradio', { name: /앨범 추가/i })
        ).toBeInTheDocument()
      })

      const addButton = screen.getByRole('menuitemradio', {
        name: /앨범 추가/i,
      })
      await user.click(addButton)

      await waitFor(() => {
        const input = screen.getByPlaceholderText('앨범 제목 입력...')
        expect(input).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText('앨범 제목 입력...')
      await user.type(input, '새 앨범')

      const inputContainer = input.closest('div')
      const buttons = inputContainer?.querySelectorAll('button[type="button"]')
      const checkButton = buttons?.[buttons.length - 1]

      expect(checkButton).toBeInTheDocument()
      if (checkButton) {
        await user.click(checkButton)
      }

      await waitFor(
        () => {
          expect(
            screen.queryByPlaceholderText('앨범 제목 입력...')
          ).not.toBeInTheDocument()
          expect(
            screen.getByRole('menuitemradio', { name: /앨범 추가/i })
          ).toBeInTheDocument()
        },
        { timeout: 3000 }
      )
    })

    it('X 버튼을 클릭하면 input이 사라지고 "앨범 추가" 버튼으로 돌아간다', async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={-1} onSelect={mockOnSelect} />
      )

      const trigger = screen.getByRole('button', { name: /앨범 없음/i })
      await user.click(trigger)

      await waitFor(() => {
        expect(
          screen.getByRole('menuitemradio', { name: /앨범 추가/i })
        ).toBeInTheDocument()
      })

      const addButton = screen.getByRole('menuitemradio', {
        name: /앨범 추가/i,
      })
      await user.click(addButton)

      await waitFor(() => {
        const input = screen.getByPlaceholderText('앨범 제목 입력...')
        expect(input).toBeInTheDocument()
      })

      const cancelButton = screen
        .getByPlaceholderText('앨범 제목 입력...')
        .closest('div')
        ?.querySelector('button[type="button"]:first-of-type')

      if (cancelButton) {
        await user.click(cancelButton)
      }

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText('앨범 제목 입력...')
        ).not.toBeInTheDocument()
        expect(
          screen.getByRole('menuitemradio', { name: /앨범 추가/i })
        ).toBeInTheDocument()
      })

      expect(
        screen.getByRole('menuitemradio', { name: /앨범 없음/i })
      ).toBeInTheDocument()
    })

    it('Escape 키를 누르면 input이 사라지고 "앨범 추가" 버튼으로 돌아간다', async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={-1} onSelect={mockOnSelect} />
      )

      const trigger = screen.getByRole('button', { name: /앨범 없음/i })
      await user.click(trigger)

      await waitFor(() => {
        expect(
          screen.getByRole('menuitemradio', { name: /앨범 추가/i })
        ).toBeInTheDocument()
      })

      const addButton = screen.getByRole('menuitemradio', {
        name: /앨범 추가/i,
      })
      await user.click(addButton)

      await waitFor(() => {
        const input = screen.getByPlaceholderText('앨범 제목 입력...')
        expect(input).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText('앨범 제목 입력...')
      await user.type(input, '테스트')
      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText('앨범 제목 입력...')
        ).not.toBeInTheDocument()
        expect(
          screen.getByRole('menuitemradio', { name: /앨범 추가/i })
        ).toBeInTheDocument()
      })
    })
  })

  describe('앨범 수정', () => {
    it('연필 아이콘을 클릭하면 input 필드가 나타나고 기존 제목이 입력되어 있다', async () => {
      const user = userEvent.setup()
      server.use(
        http.get('*/api/v1/albums/users/*', () => {
          return HttpResponse.json({
            code: '200',
            message: 'Success',
            isSuccess: true,
            data: [
              {
                albumId: 1,
                title: '여행 앨범',
                thumbnailImageUrl: '',
                postCount: 0,
              },
            ],
          })
        })
      )

      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={-1} onSelect={mockOnSelect} />
      )

      const trigger = screen.getByRole('button', { name: /앨범 없음/i })
      await user.click(trigger)

      await waitFor(() => {
        expect(
          screen.getByRole('menuitemradio', { name: /여행 앨범/i })
        ).toBeInTheDocument()
      })

      const albumItem = screen.getByRole('menuitemradio', {
        name: /여행 앨범/i,
      })
      const pencilButton = within(albumItem).queryByRole('button')

      if (pencilButton) {
        await user.click(pencilButton)
      }

      await waitFor(() => {
        const input = screen.getByPlaceholderText('앨범 제목 입력...')
        expect(input).toBeInTheDocument()
        expect(input).toHaveValue('여행 앨범')
        expect(input).toHaveFocus()
      })

      expect(
        screen.getByRole('menuitemradio', { name: /앨범 없음/i })
      ).toBeInTheDocument()
    })

    it('수정 모드에서 제목을 변경하고 Enter를 누르면 앨범 제목이 업데이트된다', async () => {
      const user = userEvent.setup()
      const queryClient = createTestQueryClient()

      server.use(
        http.get('*/api/v1/albums/users/*', () => {
          return HttpResponse.json({
            code: '200',
            message: 'Success',
            isSuccess: true,
            data: [
              {
                albumId: 1,
                title: '여행 앨범',
                thumbnailImageUrl: '',
                postCount: 0,
              },
            ],
          })
        }),
        http.patch('*/api/v1/albums/1', async () => {
          return HttpResponse.json({
            code: '200',
            message: 'Success',
            isSuccess: true,
          })
        })
      )

      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={-1} onSelect={mockOnSelect} />,
        queryClient
      )

      const trigger = screen.getByRole('button', { name: /앨범 없음/i })
      await user.click(trigger)

      await waitFor(() => {
        expect(
          screen.getByRole('menuitemradio', { name: /여행 앨범/i })
        ).toBeInTheDocument()
      })

      const albumItem = screen.getByRole('menuitemradio', {
        name: /여행 앨범/i,
      })
      const pencilButton = within(albumItem).queryByRole('button')

      if (pencilButton) {
        await user.click(pencilButton)
      }

      await waitFor(() => {
        const input = screen.getByPlaceholderText('앨범 제목 입력...')
        expect(input).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText('앨범 제목 입력...')
      await user.clear(input)
      await user.type(input, '수정된 앨범')
      await user.keyboard('{Enter}')

      await waitFor(
        () => {
          expect(
            screen.queryByPlaceholderText('앨범 제목 입력...')
          ).not.toBeInTheDocument()
          expect(
            screen.getByRole('menuitemradio', { name: /앨범 추가/i })
          ).toBeInTheDocument()
        },
        { timeout: 3000 }
      )
    })

    it('수정 모드에서 X 버튼을 클릭하면 수정이 취소되고 원래 상태로 돌아간다', async () => {
      const user = userEvent.setup()
      server.use(
        http.get('*/api/v1/albums/users/*', () => {
          return HttpResponse.json({
            code: '200',
            message: 'Success',
            isSuccess: true,
            data: [
              {
                albumId: 1,
                title: '여행 앨범',
                thumbnailImageUrl: '',
                postCount: 0,
              },
            ],
          })
        })
      )

      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={-1} onSelect={mockOnSelect} />
      )

      const trigger = screen.getByRole('button', { name: /앨범 없음/i })
      await user.click(trigger)

      await waitFor(() => {
        expect(
          screen.getByRole('menuitemradio', { name: /여행 앨범/i })
        ).toBeInTheDocument()
      })

      const albumItem = screen.getByRole('menuitemradio', {
        name: /여행 앨범/i,
      })
      const pencilButton = within(albumItem).queryByRole('button')

      if (pencilButton) {
        await user.click(pencilButton)
      }

      await waitFor(() => {
        const input = screen.getByPlaceholderText('앨범 제목 입력...')
        expect(input).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText('앨범 제목 입력...')
      await user.clear(input)
      await user.type(input, '수정된 앨범')

      const inputContainer = input.closest('div')
      const buttons = inputContainer?.querySelectorAll('button[type="button"]')
      const cancelButton = buttons?.[0]

      expect(cancelButton).toBeInTheDocument()
      if (cancelButton) {
        await user.click(cancelButton)
      }

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText('앨범 제목 입력...')
        ).not.toBeInTheDocument()
        expect(
          screen.getByRole('menuitemradio', { name: /여행 앨범/i })
        ).toBeInTheDocument()
      })
    })

    it('수정 모드에서 Escape 키를 누르면 수정이 취소된다', async () => {
      const user = userEvent.setup()
      server.use(
        http.get('*/api/v1/albums/users/*', () => {
          return HttpResponse.json({
            code: '200',
            message: 'Success',
            isSuccess: true,
            data: [
              {
                albumId: 1,
                title: '여행 앨범',
                thumbnailImageUrl: '',
                postCount: 0,
              },
            ],
          })
        })
      )

      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={-1} onSelect={mockOnSelect} />
      )

      const trigger = screen.getByRole('button', { name: /앨범 없음/i })
      await user.click(trigger)

      await waitFor(() => {
        expect(
          screen.getByRole('menuitemradio', { name: /여행 앨범/i })
        ).toBeInTheDocument()
      })

      const albumItem = screen.getByRole('menuitemradio', {
        name: /여행 앨범/i,
      })
      const pencilButton = within(albumItem).queryByRole('button')

      if (pencilButton) {
        await user.click(pencilButton)
      }

      await waitFor(() => {
        const input = screen.getByPlaceholderText('앨범 제목 입력...')
        expect(input).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText('앨범 제목 입력...')
      await user.clear(input)
      await user.type(input, '수정된 앨범')
      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText('앨범 제목 입력...')
        ).not.toBeInTheDocument()
        expect(
          screen.getByRole('menuitemradio', { name: /여행 앨범/i })
        ).toBeInTheDocument()
      })
    })
  })

  describe('드롭다운 상태 유지', () => {
    it('앨범 추가 완료 후에도 드롭다운이 열려있다', async () => {
      const user = userEvent.setup()
      const queryClient = createTestQueryClient()

      server.use(
        http.get('*/api/v1/albums/users/*', () => {
          return HttpResponse.json({
            code: '200',
            message: 'Success',
            isSuccess: true,
            data: [],
          })
        }),
        http.post('*/api/v1/albums', async () => {
          return HttpResponse.json({
            code: '200',
            message: 'Success',
            isSuccess: true,
            data: 3,
          })
        })
      )

      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={-1} onSelect={mockOnSelect} />,
        queryClient
      )

      const trigger = screen.getByRole('button', { name: /앨범 없음/i })
      await user.click(trigger)

      await waitFor(() => {
        expect(
          screen.getByRole('menuitemradio', { name: /앨범 추가/i })
        ).toBeInTheDocument()
      })

      const addButton = screen.getByRole('menuitemradio', {
        name: /앨범 추가/i,
      })
      await user.click(addButton)

      await waitFor(() => {
        const input = screen.getByPlaceholderText('앨범 제목 입력...')
        expect(input).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText('앨범 제목 입력...')
      await user.type(input, '새 앨범')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(
          screen.getByRole('menuitemradio', { name: /앨범 없음/i })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('menuitemradio', { name: /앨범 추가/i })
        ).toBeInTheDocument()
      })
    })

    it('앨범 수정 완료 후에도 드롭다운이 열려있다', async () => {
      const user = userEvent.setup()
      const queryClient = createTestQueryClient()

      server.use(
        http.get('*/api/v1/albums/users/*', () => {
          return HttpResponse.json({
            code: '200',
            message: 'Success',
            isSuccess: true,
            data: [
              {
                albumId: 1,
                title: '여행 앨범',
                thumbnailImageUrl: '',
                postCount: 0,
              },
            ],
          })
        }),
        http.patch('*/api/v1/albums/1', async () => {
          return HttpResponse.json({
            code: '200',
            message: 'Success',
            isSuccess: true,
          })
        })
      )

      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={-1} onSelect={mockOnSelect} />,
        queryClient
      )

      const trigger = screen.getByRole('button', { name: /앨범 없음/i })
      await user.click(trigger)

      await waitFor(() => {
        expect(
          screen.getByRole('menuitemradio', { name: /여행 앨범/i })
        ).toBeInTheDocument()
      })

      const albumItem = screen.getByRole('menuitemradio', {
        name: /여행 앨범/i,
      })
      const pencilButton = within(albumItem).queryByRole('button')

      if (pencilButton) {
        await user.click(pencilButton)
      }

      await waitFor(() => {
        const input = screen.getByPlaceholderText('앨범 제목 입력...')
        expect(input).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText('앨범 제목 입력...')
      await user.clear(input)
      await user.type(input, '수정된 앨범')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(
          screen.getByRole('menuitemradio', { name: /앨범 없음/i })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('menuitemradio', { name: /앨범 추가/i })
        ).toBeInTheDocument()
      })
    })
  })

  describe('중복 생성 방지', () => {
    it('Enter 키를 여러 번 눌러도 앨범이 한 번만 생성된다', async () => {
      const user = userEvent.setup()
      const queryClient = createTestQueryClient()
      let createCallCount = 0

      server.use(
        http.get('*/api/v1/albums/users/*', () => {
          return HttpResponse.json({
            code: '200',
            message: 'Success',
            isSuccess: true,
            data: [],
          })
        }),
        http.post('*/api/v1/albums', async () => {
          createCallCount++
          return HttpResponse.json({
            code: '200',
            message: 'Success',
            isSuccess: true,
            data: 3,
          })
        })
      )

      renderWithProviders(
        <AlbumSelectDropdown selectedAlbumId={-1} onSelect={mockOnSelect} />,
        queryClient
      )

      const trigger = screen.getByRole('button', { name: /앨범 없음/i })
      await user.click(trigger)

      await waitFor(() => {
        expect(
          screen.getByRole('menuitemradio', { name: /앨범 추가/i })
        ).toBeInTheDocument()
      })

      const addButton = screen.getByRole('menuitemradio', {
        name: /앨범 추가/i,
      })
      await user.click(addButton)

      await waitFor(() => {
        const input = screen.getByPlaceholderText('앨범 제목 입력...')
        expect(input).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText('앨범 제목 입력...')
      await user.type(input, '새 앨범')

      await user.keyboard('{Enter}')
      await user.keyboard('{Enter}')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(createCallCount).toBe(1)
      })
    })
  })
})
