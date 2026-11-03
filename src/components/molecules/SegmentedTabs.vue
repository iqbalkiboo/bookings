<script setup lang="ts" generic="T extends string">
export interface SegmentedTab<V extends string = string> {
  value: V
  label: string
  hint?: string
}

defineProps<{
  tabs: SegmentedTab<T>[]
  modelValue: T
}>()

defineEmits<{ 'update:modelValue': [value: T] }>()
</script>

<template>
  <div class="seg" role="tablist">
    <button
      v-for="tab in tabs"
      :id="`tab-${tab.value}`"
      :key="tab.value"
      type="button"
      class="seg-btn"
      :class="{ 'seg-btn--on': modelValue === tab.value }"
      role="tab"
      :aria-selected="modelValue === tab.value"
      @click="$emit('update:modelValue', tab.value)"
    >
      {{ tab.label }} <small v-if="tab.hint">{{ tab.hint }}</small>
    </button>
  </div>
</template>

<style scoped lang="scss" src="@/assets/styles/molecules/segmented-tabs.scss"></style>

