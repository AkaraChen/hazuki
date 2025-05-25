<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { images } from './images'

// Pagination settings
const pageSize = 12
const currentPage = ref(1)
const loading = ref(false)

// Compute displayed images based on current page
const displayedImages = computed(() => {
  return images.slice(0, currentPage.value * pageSize)
})

// Check if there are more images to load
const hasMoreImages = computed(() => {
  return displayedImages.value.length < images.length
})

// Load more images when scrolled to bottom
const loadMoreImages = () => {
  if (loading.value || !hasMoreImages.value) return
  
  loading.value = true
  
  // Simulate network delay (remove in production)
  setTimeout(() => {
    currentPage.value++
    loading.value = false
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

// Setup and cleanup scroll event listener
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="waterfall-container">
    <div class="waterfall">
      <div v-for="(image, key) in displayedImages" :key="key" class="waterfall-item">
        <img :src="image" alt="waterfall image" />
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading more images...</p>
    </div>
    
    <!-- End of content message -->
    <div v-if="!hasMoreImages && displayedImages.length > 0" class="end-message">
      <p>You've reached the end of the gallery</p>
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
  column-count: 4; /* Default number of columns */
  column-gap: 15px;
  width: 100%;
}

.waterfall-item {
  break-inside: avoid; /* Prevents item from breaking across columns */
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
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
  to { transform: rotate(360deg); }
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
