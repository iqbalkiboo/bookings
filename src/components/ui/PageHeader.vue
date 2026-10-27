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

<style scoped>
.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-line);
  position: relative;
}
.page-header-bar {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  box-shadow: 0 0 10px rgba(227,0,27,0.6);
  border-radius: 999px;
}
.page-header-title {
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--color-heading);
  margin-bottom: 0.25rem;
  line-height: 1.2;
}
.page-header-subtitle {
  font-size: 0.875rem;
  color: var(--color-muted);
  font-weight: 600;
}
</style>
