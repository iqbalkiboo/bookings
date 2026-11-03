<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 0–100 */
    percent: number
    tone?: 'primary' | 'danger' | 'success' | 'accent' | 'gold'
    showLabel?: boolean
  }>(),
  { tone: 'primary', showLabel: false },
)

const TONE_STYLES: Record<string, string> = {
  primary: 'linear-gradient(90deg, #e3001b, #ff4455)',
  danger:  'linear-gradient(90deg, #e3001b, #ff6600)',
  success: 'linear-gradient(90deg, #00c96e, #00ff99)',
  accent:  'linear-gradient(90deg, #00d4ff, #0099bb)',
  gold:    'linear-gradient(90deg, #f7c700, #ffdd44)',
}
const GLOW_COLORS: Record<string, string> = {
  primary: 'rgba(227,0,27,0.5)',
  danger:  'rgba(255,80,0,0.5)',
  success: 'rgba(0,201,110,0.5)',
  accent:  'rgba(0,212,255,0.5)',
  gold:    'rgba(247,199,0,0.5)',
}

const fillStyle = computed(() => ({
  width: `${Math.min(100, Math.max(0, props.percent))}%`,
  background: TONE_STYLES[props.tone],
  boxShadow: `0 0 8px ${GLOW_COLORS[props.tone]}`,
}))
</script>

<template>
  <div>
    <div class="progress-track">
      <div class="progress-fill" :style="fillStyle"></div>
    </div>
    <p v-if="showLabel" class="progress-label">{{ percent }}%</p>
  </div>
</template>

<style scoped lang="scss" src="@/assets/styles/atoms/progress-bar.scss"></style>
