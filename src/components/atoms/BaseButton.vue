<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'light' | 'danger' | 'accent'
    size?: 'sm' | 'md' | 'lg'
    to?: string
    type?: 'button' | 'submit'
    disabled?: boolean
    block?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    to: undefined,
    type: 'button',
    disabled: false,
    block: false,
  },
)

const VARIANT_CLASSES: Record<string, string> = {
  primary:   'btn btn-primary',
  secondary: 'btn btn-secondary',
  ghost:     'btn btn-ghost',
  light:     'btn btn-light',
  danger:    'btn btn-danger',
  accent:    'btn btn-accent',
}

const SIZE_CLASSES: Record<string, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}

const classes = computed(() => [
  VARIANT_CLASSES[props.variant],
  SIZE_CLASSES[props.size],
  props.block ? 'btn-block' : '',
  props.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
])
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="classes">
    <slot />
  </RouterLink>
  <button v-else :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
