<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue'
import images from './images.json'

// Pagination settings
const pageSize = 12
const currentPage = ref(1)
const loading = ref(false)

// Column settings
const columnCount = ref(4) // Default column count
const columns = reactive<(string[])[]>(Array(columnCount.value).fill(undefined).map(() => []))

// Compute displayed images based on current page
const displayedImages = computed(() => {
  return images.slice(0, currentPage.value * pageSize)
})

// Check if there are more images to load
const hasMoreImages = computed(() => {
  return displayedImages.value.length < images.length
})

// Distribute images into columns
const distributeImages = () => {
  // Clear existing columns
  columns.forEach(column => column.length = 0)

  // Distribute images to columns (one by one to each column)
  displayedImages.value.forEach((image, index) => {
    const columnIndex = index % columnCount.value
    columns[columnIndex].push(image)
  })
}

// Update columns when window resizes
const updateColumnCount = () => {
  let newColumnCount = 4 // Default

  if (window.innerWidth <= 480) {
    newColumnCount = 1
  } else if (window.innerWidth <= 768) {
    newColumnCount = 2
  } else if (window.innerWidth <= 1200) {
    newColumnCount = 3
  }

  if (newColumnCount !== columnCount.value) {
    columnCount.value = newColumnCount
    // Resize columns array
    while (columns.length > columnCount.value) {
      columns.pop()
    }
    while (columns.length < columnCount.value) {
      columns.push([])
    }
    // Redistribute images
    distributeImages()
  }
}

// Load more images when scrolled to bottom
const loadMoreImages = () => {
  if (loading.value || !hasMoreImages.value) return

  loading.value = true

  // Simulate network delay (remove in production)
  setTimeout(() => {
    currentPage.value++
    loading.value = false
    distributeImages() // Redistribute images after loading more
  }, 500)
}

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
  window.addEventListener('resize', updateColumnCount)

  // Initial setup
  updateColumnCount()
  distributeImages()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateColumnCount)
})
</script>

<template>
  <github-corners repo="AkaraChen/hazuki" blank />
  <div class="waterfall-container">
    <div class="waterfall">
      <!-- Each column is a separate div -->
      <div v-for="(column, colIndex) in columns" :key="'col-' + colIndex" class="waterfall-column">
        <!-- Each image in the column -->
        <div v-for="(image, imgIndex) in column" :key="'img-' + colIndex + '-' + imgIndex" class="waterfall-item">
          <img :src="image" alt="waterfall image" />
        </div>
      </div>
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- End of content message -->
    <div v-if="!hasMoreImages && displayedImages.length > 0" class="end-message">
      <p>已加载全部</p>
    </div>
  </div>
</template>

<style scoped>
.waterfall-container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.waterfall {
  display: flex;
  width: 100%;
  gap: 15px;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.waterfall-item {
  border-radius: 8px;
  overflow: hidden;
  /* Each item maintains its position in its column */
  position: relative;
}

.waterfall-item img {
  width: 100%;
  display: block;
  transition: transform 0.3s ease;
}

.waterfall-item img:hover {
  transform: scale(1.02);
}

/* Loading indicator styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  width: 100%;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* End message styles */
.end-message {
  text-align: center;
  padding: 20px 0;
  color: #666;
  font-style: italic;
  border-top: 1px solid #eee;
  margin-top: 20px;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .waterfall {
    column-count: 3;
  }
}

@media (max-width: 768px) {
  .waterfall {
    column-count: 2;
  }
}

@media (max-width: 480px) {
  .waterfall {
    column-count: 1;
  }
}
</style>
