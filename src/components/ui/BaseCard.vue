<script setup lang="ts">
withDefaults(
  defineProps<{
    /** efek hover glow */
    hover?: boolean
    /** tone warna border */
    tone?: 'default' | 'accent' | 'gold'
  }>(),
  { hover: false, tone: 'default' },
)
</script>

<template>
  <div
    class="roblox-card"
    :class="{
      'roblox-card--hover': hover,
      'roblox-card--accent': tone === 'accent',
      'roblox-card--gold': tone === 'gold',
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.roblox-card {
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.45);
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.roblox-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(227,0,27,0.04) 0%, transparent 60%);
  pointer-events: none;
}
.roblox-card--hover:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 20px rgba(227,0,27,0.4), 0 0 60px rgba(227,0,27,0.1), 0 4px 24px rgba(0,0,0,0.5);
  transform: translateY(-2px);
}
.roblox-card--accent {
  border-color: rgba(0,212,255,0.3);
}
.roblox-card--accent::before {
  background: linear-gradient(135deg, rgba(0,212,255,0.06) 0%, transparent 60%);
}
.roblox-card--gold {
  border-color: rgba(247,199,0,0.3);
}
.roblox-card--gold::before {
  background: linear-gradient(135deg, rgba(247,199,0,0.06) 0%, transparent 60%);
}
</style>
