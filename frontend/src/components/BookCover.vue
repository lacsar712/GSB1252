<template>
  <img
    :src="currentSrc"
    :alt="alt"
    class="book-cover-img"
    @error="handleError"
  >
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  src?: string | null
  alt?: string
  defaultCover?: string
}>(), {
  src: null,
  alt: 'book cover',
  defaultCover: 'https://via.placeholder.com/200x280/6366f1/ffffff?text=Book'
})

const hasError = ref(false)

const currentSrc = computed(() => {
  if (hasError.value || !props.src) {
    return props.defaultCover
  }
  return props.src
})

function handleError() {
  hasError.value = true
}
</script>

<style scoped>
.book-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
