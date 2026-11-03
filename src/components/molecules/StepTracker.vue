<script setup lang="ts">
defineProps<{
  steps: string[]
  /** tahap aktif, mulai dari 1 */
  current: number
}>()
</script>

<template>
  <ol class="steps">
    <li
      v-for="(label, i) in steps"
      :key="label"
      class="step"
      :class="{ 'step--done': current > i + 1, 'step--active': current === i + 1 }"
    >
      <span class="step-dot">{{ i + 1 }}</span>
      <span class="step-label">{{ label }}</span>
    </li>
  </ol>
</template>

<style scoped lang="scss" src="@/assets/styles/molecules/step-tracker.scss"></style>

