<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    tone?: 'soft' | 'blue' | 'green' | 'amber' | 'pink' | 'purple' | 'red' | 'slate' | 'white' | 'cyan' | 'gold'
  }>(),
  { tone: 'soft' },
)

const TONE_CLASSES: Record<string, string> = {
  soft:   'badge-soft',
  blue:   'badge-blue',
  green:  'badge-green',
  amber:  'badge-amber',
  pink:   'badge-pink',
  purple: 'badge-purple',
  red:    'badge-red',
  slate:  'badge-slate',
  white:  'badge-white',
  cyan:   'badge-cyan',
  gold:   'badge-gold',
}

const classes = computed(() => ['rblx-badge', TONE_CLASSES[props.tone]])
</script>

<template>
  <span :class="classes"><slot /></span>
</template>

<style scoped lang="scss" src="@/assets/styles/atoms/base-badge.scss"></style>
