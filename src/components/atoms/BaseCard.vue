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

<style scoped lang="scss" src="@/assets/styles/atoms/base-card.scss"></style>
