<script setup lang="ts">
withDefaults(
  defineProps<{
    message: string
    icon?: string
  }>(),
  { icon: '🍿' },
)
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon animate-float">{{ icon }}</div>
    <p class="empty-message">{{ message }}</p>
    <div class="flex flex-wrap justify-center gap-2">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss" src="@/assets/styles/molecules/empty-state.scss"></style>
