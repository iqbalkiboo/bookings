<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { navItems } from '@/router/navigation'
import { useBookingsStore } from '@/stores/bookings'
import NavIcon from '@/components/atoms/NavIcon.vue'

const bookings = useBookingsStore()
const ticketCount = computed(() => bookings.tickets.length)
</script>

<template>
  <nav class="bottom-nav" aria-label="Menu utama mobile">
    <RouterLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="bottom-nav-item"
    >
      <span class="bottom-nav-icon">
        <NavIcon :name="item.icon" />
        <span
          v-if="item.icon === 'ticket' && ticketCount > 0"
          class="bottom-nav-badge"
          data-testid="ticket-badge"
        >
          {{ ticketCount > 99 ? '99+' : ticketCount }}
        </span>
      </span>
      <span class="bottom-nav-label">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss" src="@/assets/styles/organisms/bottom-nav.scss"></style>

