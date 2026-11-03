<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <section class="page-header">
    <div class="page-header-bar"></div>
    <div>
      <h1 class="page-header-title">{{ title }}</h1>
      <p v-if="subtitle" class="page-header-subtitle">{{ subtitle }}</p>
    </div>
    <slot />
  </section>
</template>

<style scoped lang="scss" src="@/assets/styles/molecules/page-header.scss"></style>
