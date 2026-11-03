<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="section-heading">
    <h2 class="section-heading-title">{{ title }}</h2>
    <slot />
  </div>
</template>

<style scoped lang="scss" src="@/assets/styles/molecules/section-heading.scss"></style>
