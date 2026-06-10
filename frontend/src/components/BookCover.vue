<template>
  <img
    :src="resolvedSrc"
    :alt="alt"
    :class="imgClass"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const DEFAULT_COVER = 'https://via.placeholder.com/200x280/6366f1/ffffff?text=Book'
const DEFAULT_THUMBNAIL = 'https://via.placeholder.com/60x80/6366f1/ffffff?text=Book'

const props = withDefaults(defineProps<{
  src?: string | null
  alt?: string
  size?: 'cover' | 'thumbnail'
  imgClass?: string
}>(), {
  src: null,
  alt: '',
  size: 'cover',
  imgClass: ''
})

const fallback = props.size === 'thumbnail' ? DEFAULT_THUMBNAIL : DEFAULT_COVER
const resolvedSrc = ref(props.src || fallback)
const hasErrored = ref(false)

watch(() => props.src, (newSrc) => {
  hasErrored.value = false
  resolvedSrc.value = newSrc || fallback
})

function onError() {
  if (!hasErrored.value) {
    hasErrored.value = true
    resolvedSrc.value = fallback
  }
}
</script>
