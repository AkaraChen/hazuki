import { ref, computed } from 'vue'

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
  const currentPage = ref(initialPage)
  const loading = ref(false)

  // Compute displayed items based on current page
  const displayedItems = computed(() => {
    return items.slice(0, currentPage.value * pageSize)
  })

  // Check if there are more items to load
  const hasMoreItems = computed(() => {
    return displayedItems.value.length < items.length
  })

  // Load more items
  const loadMoreItems = () => {
    if (loading.value || !hasMoreItems.value) return

    loading.value = true

    // Simulate network delay (remove in production)
    setTimeout(() => {
      currentPage.value++
      loading.value = false

      // Call the onLoadMore callback if provided
      if (onLoadMore) {
        onLoadMore()
      }
    }, 500)
  }

  return {
    currentPage,
    loading,
    displayedItems,
    hasMoreItems,
    loadMoreItems,
  }
}
