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

<style scoped>
.rblx-badge {
  display: inline-block;
  border-radius: 999px;
  padding: 0.18rem 0.65rem;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: 1px solid transparent;
}
.badge-soft   { background: var(--color-primary-soft); color: var(--color-primary); border-color: rgba(227,0,27,0.2); }
.badge-blue   { background: rgba(56,189,248,0.1); color: #38bdf8; border-color: rgba(56,189,248,0.2); }
.badge-green  { background: rgba(0,201,110,0.12); color: #00c96e; border-color: rgba(0,201,110,0.25); }
.badge-amber  { background: rgba(251,191,36,0.1); color: #fbbf24; border-color: rgba(251,191,36,0.2); }
.badge-pink   { background: rgba(244,114,182,0.1); color: #f472b6; border-color: rgba(244,114,182,0.2); }
.badge-purple { background: rgba(167,139,250,0.1); color: #a78bfa; border-color: rgba(167,139,250,0.2); }
.badge-red    { background: rgba(227,0,27,0.12); color: #ff4455; border-color: rgba(227,0,27,0.25); }
.badge-slate  { background: rgba(122,132,154,0.12); color: var(--color-muted); border-color: var(--color-line); }
.badge-white  { background: rgba(255,255,255,0.12); color: var(--color-heading); border-color: rgba(255,255,255,0.15); }
.badge-cyan   { background: rgba(0,212,255,0.1); color: #00d4ff; border-color: rgba(0,212,255,0.2); }
.badge-gold   { background: rgba(247,199,0,0.12); color: #f7c700; border-color: rgba(247,199,0,0.2); }
</style>
