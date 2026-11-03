<script setup lang="ts">
defineProps<{
  value: string | number
  label: string
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-0.5 rounded-xl border border-line bg-surface p-5">
    <span class="text-3xl font-bold text-primary">{{ value }}</span>
    <span class="text-sm text-muted">{{ label }}</span>
  </div>
</template>
