import { ref, onMounted, onUnmounted } from 'vue'

interface Breakpoint<T> {
  width: number
  value: T
}

interface UseBreakpointOptions<T> {
  breakpoints?: Breakpoint<T>[]
  defaultValue: T
}

export const useBreakpoint = <T>({ breakpoints = [], defaultValue }: UseBreakpointOptions<T>) => {
  // Sort breakpoints by width in descending order
  const sortedBreakpoints = [...breakpoints].sort((a, b) => b.width - a.width)

  const currentBreakpoint = ref<T>(defaultValue)

  const updateBreakpoint = () => {
    // Find the first breakpoint that matches the current window width
    const matchedBreakpoint = sortedBreakpoints.find(
      (breakpoint) => window.innerWidth <= breakpoint.width,
    )

    const newValue = matchedBreakpoint ? matchedBreakpoint.value : defaultValue

    // Update the breakpoint value
    currentBreakpoint.value = newValue
  }

  // Setup event listeners
  onMounted(() => {
    window.addEventListener('resize', updateBreakpoint)
    // Initial calculation
    updateBreakpoint()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateBreakpoint)
  })

  return {
    currentBreakpoint,
    updateBreakpoint,
  }
}
