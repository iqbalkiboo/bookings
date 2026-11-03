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

<style scoped lang="scss" src="@/assets/styles/molecules/form-field.scss"></style>
