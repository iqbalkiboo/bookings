<script setup lang="ts">
import { useBookingsStore } from '@/stores/bookings'
import PageHeader from '@/components/ui/PageHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import TicketCard from '@/components/TicketCard.vue'

const store = useBookingsStore()
</script>

<template>
  <PageHeader
    title="Tiket Saya"
    subtitle="Semua tiket bioskop & konser kamu tersimpan di sini (persist di localStorage)."
  />

  <EmptyState
    v-if="store.tickets.length === 0"
    icon="🍿"
    message="Belum ada tiket. Yuk mulai booking!"
  >
    <BaseButton to="/movies">Pesan Tiket Bioskop</BaseButton>
    <BaseButton to="/concerts" variant="secondary">Cari Tiket Konser</BaseButton>
  </EmptyState>

  <div v-else class="tickets-list">
    <div class="tickets-count">
      <span class="tickets-count-num">{{ store.tickets.length }}</span>
      <span class="tickets-count-label">tiket tersimpan</span>
    </div>
    <TicketCard
      v-for="ticket in store.tickets"
      :key="ticket.id"
      :ticket="ticket"
      @remove="store.removeTicket(ticket.id)"
    />
  </div>
</template>

<style scoped>
.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.tickets-count {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}
.tickets-count-num {
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--color-primary);
  text-shadow: 0 0 12px rgba(227,0,27,0.4);
  line-height: 1;
}
.tickets-count-label {
  font-size: 0.82rem;
  color: var(--color-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
