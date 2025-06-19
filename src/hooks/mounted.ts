import { onMounted, onUnmounted } from 'vue'

interface UseMountedOptions {
  callback: () => void
  onUnmountedCallback?: () => void
}

export const useMounted = ({ callback, onUnmountedCallback }: UseMountedOptions) => {
  onMounted(() => {
    callback()
  })

  onUnmounted(() => {
    onUnmountedCallback?.()
  })
}
