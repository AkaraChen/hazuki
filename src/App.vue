<script setup lang="ts">
import { ref, reactive } from 'vue'
import images from './images.json'
import { directive as viewer } from 'v-viewer'
import { shuffleArray } from './utils'
import { useOnScrollToEnd } from './hooks/on-scroll-to-end'
import { useMounted } from './hooks/mounted'
import { useLoadMore } from './hooks/use-load-more'

const vViewer = viewer()
const showViewer = () => {
  // @ts-expect-error fuck vue ecosystem
  const viewer = document.querySelector('.images').$viewer
  viewer.show()
}

// Shuffle images on load
const shuffledImages = shuffleArray(images)

// Column settings
const columnCount = ref(4) // Default column count
const columns = reactive<string[][]>(
  Array(columnCount.value)
    .fill(undefined)
    .map(() => []),
)

// Distribute images into columns
const distributeImages = () => {
  // Clear existing columns
  columns.forEach((column) => (column.length = 0))

  // Distribute images to columns (one by one to each column)
  displayedItems.value.forEach((image, index) => {
    const columnIndex = index % columnCount.value
    columns[columnIndex].push(image)
  })
}

// Use the load more hook
const {
  loading,
  displayedItems,
  hasMoreItems: hasMoreImages,
  loadMoreItems: loadMoreImages
} = useLoadMore({
  items: shuffledImages,
  pageSize: 12,
  initialPage: 1,
  onLoadMore: distributeImages
})

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

useOnScrollToEnd({ loadMoreImages })

useMounted({
  callback: () => {
    window.addEventListener('resize', updateColumnCount)

    // Initial setup
    updateColumnCount()
    distributeImages()
  },
  onUnmountedCallback: () => {
    window.removeEventListener('resize', updateColumnCount)
  },
})
</script>

<template>
  <div class="container">
    <github-corners repo="AkaraChen/hazuki" blank />
    <header class="site-header">
      <h1>反田叶月 collection！</h1>
      <a href="https://x.com/tanda_hazuki" target="_blank" class="social-link">
        <img src="./assets/x.svg" alt="X (Twitter)" class="x-icon" />
      </a>
    </header>
    <div class="waterfall-container">
      <div class="waterfall">
        <!-- Each column is a separate div -->
        <div v-for="(column, colIndex) in columns" :key="'col-' + colIndex" class="waterfall-column">
          <!-- Each image in the column -->
          <div v-for="(image, imgIndex) in column" :key="'img-' + colIndex + '-' + imgIndex" class="waterfall-item">
            <img :src="image" alt="waterfall image" v-viewer="{
              transition: false,
              title: false,
              toolbar: false,
              navbar: false,
              movable: false,
              zoomable: false,
            }" @click="showViewer" />
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- End of content message -->
      <div v-if="!hasMoreImages && displayedItems.length > 0" class="end-message">
        <p>已加载全部</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --background-color: #ffffff;
  --text-color: #333333;
  --border-color: #eaeaea;
  --end-message-color: #666;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background-color: #222222;
    --text-color: #f5f5f5;
    --border-color: #444444;
    --end-message-color: #aaaaaa;
  }
}

.container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: var(--background-color);
  color: var(--text-color);
}

.site-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.site-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: var(--text-color);
}

.social-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.social-link:hover {
  transform: scale(1.1);
}

.x-icon {
  width: 24px;
  height: 24px;
  margin-left: 12px;
}

@media (prefers-color-scheme: dark) {
  .x-icon {
    filter: invert(1);
  }
}

.waterfall-container {
  width: 100%;
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
  color: var(--end-message-color);
  font-style: italic;
  border-top: 1px solid var(--border-color);
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
