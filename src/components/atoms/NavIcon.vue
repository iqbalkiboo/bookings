<script setup lang="ts">
import type { NavItem } from '@/router/navigation'

withDefaults(
  defineProps<{
    name: NavItem['icon']
    size?: number
  }>(),
  { size: 22 },
)
</script>

<template>
  <svg
    class="nav-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    :data-icon="name"
  >
    <path v-if="name === 'home'" d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    <template v-else-if="name === 'film'">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
    </template>
    <template v-else-if="name === 'mic'">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </template>
    <template v-else-if="name === 'ticket'">
      <path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z" />
      <path d="M13 6v12" stroke-dasharray="2 2" />
    </template>
  </svg>
</template>

