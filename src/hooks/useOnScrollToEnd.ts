import { useEffect, useCallback } from 'react'

interface UseOnScrollToEndOptions {
  onScrollToEnd: () => void
  threshold?: number
}

export const useOnScrollToEnd = ({ onScrollToEnd, threshold = 200 }: UseOnScrollToEndOptions) => {
  const handleScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight

    if (scrollHeight - scrollTop - clientHeight < threshold) {
      onScrollToEnd()
    }
  }, [onScrollToEnd, threshold])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])
}
