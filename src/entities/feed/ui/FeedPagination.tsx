import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination'

type FeedPaginationProps = {
  page: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
  onPageChange: (page: number) => void
}

export function FeedPagination({
  page,
  totalPages,
  hasPrev,
  hasNext,
  onPageChange,
}: FeedPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={!hasPrev}
            onClick={(e) => {
              e.preventDefault()
              if (hasPrev) onPageChange(Math.max(1, page - 1))
            }}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink isActive size="default">
            {page} / {totalPages}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={!hasNext}
            onClick={(e) => {
              e.preventDefault()
              if (hasNext) onPageChange(page + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
