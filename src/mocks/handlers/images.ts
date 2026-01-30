import { http, HttpResponse } from 'msw'

const MOCK_S3_BASE = 'https://s3.mock.example.com/bucket'

export const imageHandlers = [
  http.post('*/api/images/upload', async ({ request }) => {
    const contentType = request.headers.get('Content-Type') ?? ''
    if (
      !contentType.includes('multipart/form-data') &&
      !contentType.includes('application/x-www-form-urlencoded')
    ) {
      return HttpResponse.json(
        { message: 'Content-Type must be multipart/form-data' },
        { status: 400 }
      )
    }

    const formData = await request.formData().catch(() => null)
    if (!formData) {
      return HttpResponse.json(
        { message: 'Invalid form data' },
        { status: 400 }
      )
    }

    const images = formData
      .getAll('image')
      .filter((v): v is File => v instanceof File)
    if (images.length === 0) {
      return HttpResponse.json(
        { message: 'No image file(s) under key "image"' },
        { status: 400 }
      )
    }

    const urls = images.map((file) => {
      const uuid = crypto.randomUUID().replace(/-/g, '')
      const name = file.name || 'image'
      return `${MOCK_S3_BASE}/${uuid}_${name}`
    })

    return HttpResponse.json(urls, { status: 200 })
  }),
]
