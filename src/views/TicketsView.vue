<script setup lang="ts">
import { useBookingsStore } from '@/stores/bookings'
import PageHeader from '@/components/molecules/PageHeader.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import TicketCard from '@/components/organisms/TicketCard.vue'

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

<style scoped lang="scss" src="@/assets/styles/pages/tickets.scss"></style>
