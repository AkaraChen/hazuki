<script setup lang="ts">
import { images } from './images'
</script>

<template>
  <div class="waterfall-container">
    <div class="waterfall">
      <div v-for="(image, key) in images" :key="key" class="waterfall-item">
        <img :src="image" alt="waterfall image" />
      </div>
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
