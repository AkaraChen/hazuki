import { onMounted, onUnmounted } from 'vue'

interface UseOnScrollToEndOptions {
  loadMoreImages: () => void
}

export const useOnScrollToEnd = ({ loadMoreImages }: UseOnScrollToEndOptions) => {
  // Scroll event handler
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight

    // Check if scrolled to bottom (with 200px threshold)
    if (scrollHeight - scrollTop - clientHeight < 200) {
      loadMoreImages()
    }
  }

  // Setup event listeners and initial distribution
  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
}
