<script setup lang="ts">
defineProps<{
  label: string
  hint?: string
}>()
</script>

<template>
  <label class="form-field">
    <span class="form-field-label">{{ label }}</span>
    <slot />
    <span v-if="hint" class="form-field-hint">{{ hint }}</span>
  </label>
</template>

<style scoped>
.form-field {
  display: block;
  margin-bottom: 0.85rem;
}
.form-field-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: 0.4rem;
  letter-spacing: 0.01em;
}
.form-field-hint {
  display: block;
  font-size: 0.72rem;
  color: var(--color-muted);
  margin-top: 0.3rem;
  font-weight: 600;
}
</style>
