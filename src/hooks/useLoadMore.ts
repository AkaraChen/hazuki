import { useCallback, useMemo, useState } from 'react'

interface UseLoadMoreOptions<T> {
  items: T[]
  pageSize?: number
  initialPage?: number
  onLoadMore?: () => void
}

export const useLoadMore = <T>({
  items,
  pageSize = 12,
  initialPage = 1,
  onLoadMore,
}: UseLoadMoreOptions<T>) => {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)

  const displayedItems = useMemo(() => {
    return items.slice(0, currentPage * pageSize)
  }, [items, currentPage, pageSize])

  const hasMoreItems = useMemo(() => {
    return displayedItems.length < items.length
  }, [displayedItems.length, items.length])

  const loadMoreItems = useCallback(() => {
    if (loading || !hasMoreItems) return

    setLoading(true)

    setTimeout(() => {
      setCurrentPage((prev) => prev + 1)
      setLoading(false)
      onLoadMore?.()
    }, 500)
  }, [loading, hasMoreItems, onLoadMore])

  return {
    currentPage,
    loading,
    displayedItems,
    hasMoreItems,
    loadMoreItems,
  }
}
