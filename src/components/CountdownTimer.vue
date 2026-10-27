<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  /** timestamp (ms) berakhirnya hitungan */
  endsAt: number
}>()

const emit = defineEmits<{ expired: [] }>()

const now = ref(Date.now())
let timer: number | undefined
let expiredFired = false

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = Date.now()
    if (now.value >= props.endsAt && !expiredFired) {
      expiredFired = true
      emit('expired')
    }
  }, 500)
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})

const remainingMs = computed(() => Math.max(0, props.endsAt - now.value))
const isUrgent = computed(() => remainingMs.value > 0 && remainingMs.value <= 15_000)

const label = computed(() => {
  const totalSeconds = Math.ceil(remainingMs.value / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})
</script>

<template>
  <span
    class="font-bold tabular-nums"
    :class="isUrgent ? 'animate-blink text-danger' : 'text-primary'"
  >
    {{ label }}
  </span>
</template>
