<script setup lang="ts" generic="T extends string">
export interface ChipOption<V extends string = string> {
  key: V
  label: string
  count?: number
}

defineProps<{
  options: ChipOption<T>[]
  modelValue: T
}>()

defineEmits<{ 'update:modelValue': [value: T] }>()
</script>

<template>
  <div class="chips" role="tablist">
    <button
      v-for="opt in options"
      :id="`filter-${opt.key}`"
      :key="opt.key"
      type="button"
      class="chip"
      :class="{ 'chip-on': modelValue === opt.key }"
      role="tab"
      :aria-selected="modelValue === opt.key"
      @click="$emit('update:modelValue', opt.key)"
    >
      {{ opt.label }} <small v-if="opt.count !== undefined">{{ opt.count }}</small>
    </button>
  </div>
</template>

<style scoped lang="scss" src="@/assets/styles/molecules/filter-chips.scss"></style>

