<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="section-heading">
    <h2 class="section-heading-title">{{ title }}</h2>
    <slot />
  </div>
</template>

<style scoped>
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}
.section-heading-title {
  font-size: 1.05rem;
  font-weight: 900;
  color: var(--color-heading);
  letter-spacing: 0.01em;
  position: relative;
  padding-left: 0.75rem;
}
.section-heading-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 70%;
  background: linear-gradient(180deg, var(--color-primary), var(--color-accent));
  border-radius: 999px;
  box-shadow: 0 0 8px rgba(227,0,27,0.5);
}
</style>
