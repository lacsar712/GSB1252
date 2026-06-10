<template>
  <img
    :src="currentSrc"
    :alt="alt"
    :class="['book-cover-img', { 'is-thumbnail': thumbnail }]"
    @error="handleError"
  >
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Props {
  /** 原始封面图地址，可能为 null/空字符串 */
  src?: string | null
  /** 图片 alt 文案 */
  alt?: string
  /** 占位图地址，缺省按尺寸生成 placeholder */
  fallback?: string
  /** 是否为缩略图（表格场景） */
  thumbnail?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '',
  fallback: '',
  thumbnail: false
})

const defaultFallback = computed(() =>
  props.thumbnail
    ? 'https://via.placeholder.com/60x80/6366f1/ffffff?text=Book'
    : 'https://via.placeholder.com/200x280/6366f1/ffffff?text=Book'
)

const finalFallback = computed(() => props.fallback || defaultFallback.value)
const currentSrc = ref<string>(props.src || finalFallback.value)
const errored = ref(false)

watch(
  () => props.src,
  (val) => {
    errored.value = false
    currentSrc.value = val || finalFallback.value
  }
)

function handleError() {
  if (errored.value) return
  errored.value = true
  currentSrc.value = finalFallback.value
}
</script>

<style scoped>
.book-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.book-cover-img.is-thumbnail {
  width: 40px;
  height: 55px;
  border-radius: 4px;
}
</style>
