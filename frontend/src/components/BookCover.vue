<template>
  <img
    :src="imageSrc"
    :alt="alt"
    :class="className"
    @error="handleError"
  >
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  src?: string | null
  alt?: string
  placeholder?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '',
  placeholder: 'https://via.placeholder.com/200x280/6366f1/ffffff?text=Book',
  className: ''
})

const hasError = ref(false)

const imageSrc = computed(() => {
  if (hasError.value || !props.src) {
    return props.placeholder
  }
  return props.src
})

function handleError() {
  hasError.value = true
}
</script>
